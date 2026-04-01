import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { RecordSettlementCommand } from '../commands/record-settlement.command';
import { PaymentSettledEvent } from '@contexts/payment/domain/transaction.aggregate';

@Injectable()
export class RecordSettlementListener {
  private readonly logger = new Logger(RecordSettlementListener.name);

  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('payment.settled')
  async handle(event: PaymentSettledEvent): Promise<void> {
    this.logger.log(`Settlement triggered for txn: ${event.transactionId}`);
    await this.commandBus.execute(
      new RecordSettlementCommand(
        event.transactionId,
        event.merchantId,
        event.amount,
        event.currency,
        event.rail,
      ),
    );
  }
}
