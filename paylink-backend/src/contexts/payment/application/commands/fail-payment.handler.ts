import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { FailPaymentCommand } from './fail-payment.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/ports/transaction-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';
import { PaymentSseService } from '../../infrastructure/payment-sse.service';

@CommandHandler(FailPaymentCommand)
export class FailPaymentHandler implements ICommandHandler<FailPaymentCommand> {
  private readonly logger = new Logger(FailPaymentHandler.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
    private readonly eventBus: EventBus,
    private readonly sseService: PaymentSseService,
  ) {}

  async execute(cmd: FailPaymentCommand): Promise<void> {
    const txn = await this.repo.findById(cmd.transactionId);
    if (!txn) throw new NotFoundError('Transaction', cmd.transactionId);
    if (txn.status === 'FAILED') return; // idempotent
    txn.markFailed(cmd.failureCode);
    await this.repo.save(txn);
    for (const event of txn.domainEvents) {
      this.eventBus.publish(event);
    }
    txn.clearEvents();
    this.sseService.push(cmd.transactionId, { status: 'FAILED', failureCode: cmd.failureCode });
    this.logger.log(
      `Payment failed: ${cmd.transactionId} code=${cmd.failureCode}`,
    );
  }
}
