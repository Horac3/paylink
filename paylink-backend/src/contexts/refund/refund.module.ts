import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
import { RefundController } from './interface/refund.controller';
import { InitiateRefundHandler } from './application/commands/initiate-refund.handler';
import { CompleteRefundHandler } from './application/commands/complete-refund.handler';
import { FailRefundHandler } from './application/commands/fail-refund.handler';
import {
  GetRefundHandler,
  ListRefundsHandler,
} from './application/queries/get-refund.handler';
import { RefundCallbackProcessor } from './application/processors/refund-callback.processor';
import { RefundPollingProcessor } from './application/processors/refund-polling.processor';
import { PrismaRefundRepository } from './infrastructure/prisma-refund.repository';
import { REFUND_REPOSITORY } from './domain/ports/refund-repository.interface';
import { PaymentModule } from '../payment/payment.module';

const CommandHandlers = [
  InitiateRefundHandler,
  CompleteRefundHandler,
  FailRefundHandler,
];
const QueryHandlers = [GetRefundHandler, ListRefundsHandler];

@Module({
  imports: [
    CqrsModule,
    PaymentModule,
    BullModule.registerQueue(
      { name: 'payment-callbacks' },
      { name: 'refund-polling' },
    ),
  ],
  controllers: [RefundController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    RefundCallbackProcessor,
    RefundPollingProcessor,
    { provide: REFUND_REPOSITORY, useClass: PrismaRefundRepository },
  ],
  exports: [REFUND_REPOSITORY],
})
export class RefundModule {}
