import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { SettlePaymentCommand } from './settle-payment.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/ports/transaction-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';

@CommandHandler(SettlePaymentCommand)
export class SettlePaymentHandler implements ICommandHandler<SettlePaymentCommand> {
  private readonly logger = new Logger(SettlePaymentHandler.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: SettlePaymentCommand): Promise<void> {
    const txn = await this.repo.findById(cmd.transactionId);
    if (!txn) throw new NotFoundError('Transaction', cmd.transactionId);

    // Idempotency: already settled
    if (txn.status === 'SUCCESS') {
      this.logger.log(
        `Idempotent settle — already SUCCESS: ${cmd.transactionId}`,
      );
      return;
    }

    txn.setExternalRef(cmd.externalRef);
    if (cmd.receiptNumber) txn.setReceiptNumber(cmd.receiptNumber);
    if (cmd.externalProviderRef) txn.setExternalProviderRef(cmd.externalProviderRef);
    txn.markSuccess();
    await this.repo.save(txn);

    for (const event of txn.domainEvents) {
      this.eventBus.publish(event);
    }
    txn.clearEvents();
    this.logger.log(`Payment settled: ${cmd.transactionId}`);
  }
}
