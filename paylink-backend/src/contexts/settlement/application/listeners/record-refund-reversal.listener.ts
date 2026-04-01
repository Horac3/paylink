import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { RecordRefundReversalCommand } from '../commands/record-refund-reversal.command';
import { RefundCompletedEvent } from '@contexts/refund/domain/refund.aggregate';

@Injectable()
export class RecordRefundReversalListener {
  private readonly logger = new Logger(RecordRefundReversalListener.name);

  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('refund.completed')
  async handle(event: RefundCompletedEvent): Promise<void> {
    this.logger.log(`Refund reversal triggered for refund: ${event.refundId}`);
    await this.commandBus.execute(
      new RecordRefundReversalCommand(
        event.refundId,
        event.transactionId,
        event.merchantId,
        event.amount,
        event.currency,
      ),
    );
  }
}
