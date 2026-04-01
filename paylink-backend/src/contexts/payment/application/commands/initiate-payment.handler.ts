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
import { Transaction } from '../../domain/transaction.aggregate';
import { Money } from '@shared/domain/money.vo';
import { FeeTier, FeeTierHelper } from '@shared/domain/fee-tier.vo';
import { RailRouterService } from '../../infrastructure/rail-router.service';
import { ValidateLinkQuery } from '@contexts/link-management/application/queries/validate-link.query';
import { ResolvePayerQuery } from '@contexts/payer-identity/application/queries/resolve-payer.query';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DomainError } from '@shared/errors/domain.error';
import { JwtAdapter } from '@contexts/identity/infrastructure/jwt.adapter';

@CommandHandler(InitiatePaymentCommand)
export class InitiatePaymentHandler implements ICommandHandler<InitiatePaymentCommand> {
  private readonly logger = new Logger(InitiatePaymentHandler.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
    private readonly queryBus: QueryBus,
    private readonly railRouter: RailRouterService,
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

    // 2. Resolve MSISDN
    let msisdn: string;
    let providerCode: string;
    let payerAccountId: string | null = null;

    if (cmd.payerSessionToken) {
      const payload = this.jwtAdapter.verifyAccess(cmd.payerSessionToken);
      const payer = await this.queryBus.execute(
        new ResolvePayerQuery(payload.sub),
      );
      msisdn = payer.msisdn;
      providerCode = cmd.providerCode ?? payer.preferredProvider;
      payerAccountId = payer.payerId;
    } else if (cmd.msisdn) {
      msisdn = cmd.msisdn;
      providerCode = cmd.providerCode ?? 'AIRTEL_MALAWI';
    } else {
      throw new DomainError(
        'Either payerSessionToken or msisdn must be provided',
      );
    }

    // 3. Auto-detect provider if not given
    const adapter = this.railRouter.getDefaultAdapter();
    if (!providerCode) {
      providerCode = (await adapter.predictProvider(msisdn)) ?? 'AIRTEL_MALAWI';
    }

    // 4. Calculate fees — fetch merchant tier
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

    // 5. Create PENDING transaction
    const txn = Transaction.create({
      id: uuidv4(),
      linkId: link.linkId,
      merchantId: link.merchantId,
      payerAccountId,
      grossAmount: gross,
      feeRate: feeRate.toString(),
      feeAmount,
      netAmount,
      rail: 'PAWAPAY',
      providerCode,
      externalRef: null,
    });

    await this.repo.save(txn);

    // 6. Initiate deposit with txn.id as idempotency key
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

    // 7. Schedule polling failsafe (10 min delay)
    await this.pollingQueue.add(
      'poll-deposit',
      { transactionId: txn.id },
      { delay: 10 * 60 * 1000 },
    );

    this.logger.log(`Payment initiated: ${txn.id} status=${result.status}`);
    return { transactionId: txn.id, status: result.status };
  }
}
