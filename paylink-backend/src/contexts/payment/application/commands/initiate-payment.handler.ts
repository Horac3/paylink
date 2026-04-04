import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InitiatePaymentCommand } from './initiate-payment.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/ports/transaction-repository.interface';
import {
  IRecipientTokenRepository,
  RECIPIENT_TOKEN_REPOSITORY,
} from '../../domain/ports/recipient-token-repository.interface';
import { Transaction } from '../../domain/transaction.aggregate';
import { Money } from '@shared/domain/money.vo';
import { FeeTier, FeeTierHelper } from '@shared/domain/fee-tier.vo';
import { RailRouterService } from '../../infrastructure/rail-router.service';
import { RecipientTokenService } from '../../infrastructure/recipient-token.service';
import { ValidateLinkQuery } from '@contexts/link-management/application/queries/validate-link.query';
import { ResolvePayerQuery } from '@contexts/payer-identity/application/queries/resolve-payer.query';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DomainError } from '@shared/errors/domain.error';
import { JwtAdapter } from '@contexts/identity/infrastructure/jwt.adapter';

/** All payments go through PawaPay which handles MNO routing via providerCode. */
const DEFAULT_RAIL = 'PAWAPAY';

/** Derive PawaPay providerCode from Malawian MSISDN prefix as a local fallback. */
function detectProviderFromMsisdn(msisdn: string): string | null {
  const local = msisdn.replace(/^(\+265|265)/, '');
  if (local.startsWith('88') || local.startsWith('89') || local.startsWith('99')) return 'TNM_MWI';
  if (['75', '76', '77', '78', '97'].some((p) => local.startsWith(p))) return 'AIRTEL_MWI';
  return null;
}

@CommandHandler(InitiatePaymentCommand)
export class InitiatePaymentHandler implements ICommandHandler<InitiatePaymentCommand> {
  private readonly logger = new Logger(InitiatePaymentHandler.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
    @Inject(RECIPIENT_TOKEN_REPOSITORY)
    private readonly recipientTokenRepo: IRecipientTokenRepository,
    private readonly queryBus: QueryBus,
    private readonly railRouter: RailRouterService,
    private readonly recipientTokenService: RecipientTokenService,
    private readonly eventBus: EventBus,
    private readonly prisma: PrismaService,
    private readonly jwtAdapter: JwtAdapter,
    @InjectQueue('payment-polling') private readonly pollingQueue: Queue,
  ) {}

  async execute(
    cmd: InitiatePaymentCommand,
  ): Promise<{ transactionId: string; status: string }> {
    // 1. Validate link
    const link = await this.queryBus.execute(new ValidateLinkQuery(cmd.slug));

    // 2. Resolve MSISDN via one of three strategies
    let msisdn: string;
    let providerCode: string | undefined;
    let payerAccountId: string | null = null;

    if (cmd.payerSessionToken) {
      // Strategy A — registered payer app session
      const payload = this.jwtAdapter.verifyAccess(cmd.payerSessionToken);
      const payer = await this.queryBus.execute(
        new ResolvePayerQuery(payload.sub),
      );
      msisdn = payer.msisdn;
      providerCode = cmd.providerCode ?? payer.preferredProvider;
      payerAccountId = payer.payerId;

    } else if (cmd.recipientToken) {
      // Strategy B — pre-filled recipient token (one-time use)
      const tokenId = this.recipientTokenService.verify(cmd.recipientToken);
      const token = await this.recipientTokenRepo.findById(tokenId);
      if (!token) throw new DomainError('Recipient token not found');
      if (!token.canBeUsed()) {
        throw new DomainError('This payment link has already been used or has expired');
      }
      msisdn = this.recipientTokenService.decrypt(token.encryptedMsisdn);
      providerCode = token.providerCode;
      // Mark as used immediately — one-time only
      await this.recipientTokenRepo.markUsed(tokenId);

    } else if (cmd.msisdn) {
      // Strategy C — guest web payment
      msisdn = cmd.msisdn;
      providerCode = cmd.providerCode ?? undefined;
    } else {
      throw new DomainError(
        'No payment method provided. Supply payerSessionToken, recipientToken, or msisdn.',
      );
    }

    // 3. All payments route through PawaPay; providerCode identifies the MNO
    const rail = DEFAULT_RAIL;

    // 4. Get rail adapter and resolve provider code if missing
    const adapter = this.railRouter.getAdapter(rail);
    if (!providerCode) {
      providerCode = (await adapter.predictProvider(msisdn)) ?? detectProviderFromMsisdn(msisdn) ?? undefined;
    }
    if (!providerCode) {
      throw new DomainError(
        'Could not determine provider code from MSISDN. Please select your provider manually.',
      );
    }

    // 5. Calculate fees — fetch merchant tier
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: link.merchantId },
    });
    const feeTier = (merchant?.feeTier ?? 'STARTER') as FeeTier;
    const feeRate = FeeTierHelper.rateFor(feeTier);
    const gross = link.amount
      ? Money.of(link.amount, link.currency)
      : Money.of('0', link.currency);
    const feeAmount = gross.multiplyByRate(feeRate);
    const netAmount = gross.subtract(feeAmount);

    // 6. Create PENDING transaction
    const txn = Transaction.create({
      id: uuidv4(),
      linkId: link.linkId,
      merchantId: link.merchantId,
      payerAccountId,
      grossAmount: gross,
      feeRate: feeRate.toString(),
      feeAmount,
      netAmount,
      rail,
      providerCode,
      externalRef: null,
    });

    await this.repo.save(txn);

    // 7. Initiate deposit with txn.id as idempotency key
    const result = await adapter.initiateDeposit({
      depositId: txn.id,
      phoneNumber: msisdn,
      amount: gross.toString(),
      currency: gross.currency,
      providerCode,
      customerMessage: 'PayLink payment',
      clientReference: link.linkId,
    });

    if (result.status === 'ACCEPTED' || result.status === 'DUPLICATE_IGNORED') {
      txn.setExternalRef(result.externalRef);
      await this.repo.save(txn);
    } else {
      txn.markFailed(result.failureCode);
      await this.repo.save(txn);
    }

    for (const event of txn.domainEvents) {
      this.eventBus.publish(event);
    }
    txn.clearEvents();

    // 8. Schedule polling failsafe — PawaPay is callback-based; poll once after 10 min
    await this.pollingQueue.add(
      'poll-deposit',
      { transactionId: txn.id, rail },
      { delay: 10 * 60 * 1000, attempts: 1 },
    );

    this.logger.log(`Payment initiated: ${txn.id} rail=${rail} status=${result.status}`);
    return { transactionId: txn.id, status: result.status };
  }
}
