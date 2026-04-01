import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InitiateRefundCommand } from './initiate-refund.command';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/ports/refund-repository.interface';
import { Refund } from '../../domain/refund.aggregate';
import { Money } from '@shared/domain/money.vo';
import { DomainError } from '@shared/errors/domain.error';
import { NotFoundError } from '@shared/errors/not-found.error';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '@contexts/payment/domain/ports/transaction-repository.interface';
import { RailRouterService } from '@contexts/payment/infrastructure/rail-router.service';

@CommandHandler(InitiateRefundCommand)
export class InitiateRefundHandler implements ICommandHandler<InitiateRefundCommand> {
  private readonly logger = new Logger(InitiateRefundHandler.name);

  constructor(
    @Inject(REFUND_REPOSITORY) private readonly refundRepo: IRefundRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly txnRepo: ITransactionRepository,
    private readonly railRouter: RailRouterService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: InitiateRefundCommand): Promise<{ refundId: string }> {
    // 1. Fetch original transaction — must be SUCCESS
    const txn = await this.txnRepo.findById(cmd.transactionId);
    if (!txn) throw new NotFoundError('Transaction', cmd.transactionId);
    if (txn.status !== 'SUCCESS')
      throw new DomainError('Can only refund a successful transaction');

    // 2. Validate merchant owns this transaction
    if (txn.merchantId !== cmd.merchantId)
      throw new DomainError('Transaction does not belong to merchant');

    // 3. Check no existing PENDING or COMPLETED refund
    const existingRefunds = await this.refundRepo.findByTransactionId(
      cmd.transactionId,
    );
    const hasActiveRefund = existingRefunds.some((r) =>
      ['PENDING', 'COMPLETED'].includes(r.status),
    );
    if (hasActiveRefund)
      throw new DomainError(
        'A refund is already pending or completed for this transaction',
      );

    // 4. Validate amount <= gross
    const refundAmount = Money.of(cmd.amount, txn.grossAmount.currency);
    if (refundAmount.isGreaterThan(txn.grossAmount)) {
      throw new DomainError(
        'Refund amount exceeds original transaction amount',
      );
    }

    // 5. Create refund aggregate
    const refund = Refund.create({
      id: uuidv4(),
      transactionId: txn.id,
      merchantId: cmd.merchantId,
      depositId: txn.externalRef ?? txn.id,
      amount: refundAmount,
      currency: txn.grossAmount.currency,
      rail: txn.rail,
      reason: cmd.reason,
    });

    await this.refundRepo.save(refund);

    // 6. Initiate refund via rail
    const adapter = this.railRouter.getAdapter(txn.rail);
    const result = await adapter.initiateRefund({
      refundId: refund.id,
      depositId: txn.externalRef ?? txn.id,
      amount: refundAmount.toString(),
      currency: txn.grossAmount.currency,
    });

    if (result.status === 'ACCEPTED' || result.status === 'DUPLICATE_IGNORED') {
      refund.setExternalRef(result.externalRef);
      await this.refundRepo.save(refund);
    }

    for (const event of refund.domainEvents) {
      this.eventBus.publish(event);
    }
    refund.clearEvents();

    this.logger.log(
      `Refund initiated: ${refund.id} for txn ${cmd.transactionId}`,
    );
    return { refundId: refund.id };
  }
}
