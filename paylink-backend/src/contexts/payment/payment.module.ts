import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { CallbackController } from './interface/callback.controller';
import { PaymentController } from './interface/payment.controller';
import { InitiatePaymentHandler } from './application/commands/initiate-payment.handler';
import { SettlePaymentHandler } from './application/commands/settle-payment.handler';
import { FailPaymentHandler } from './application/commands/fail-payment.handler';
import { DepositCallbackProcessor } from './application/processors/deposit-callback.processor';
import { PollingProcessor } from './application/processors/polling.processor';
import { PawaPayAdapter } from './infrastructure/adapters/pawapay.adapter';
import { TnmAdapter } from './infrastructure/adapters/tnm.adapter';
import { AirtelAdapter } from './infrastructure/adapters/airtel.adapter';
import { AirtelSigningService } from './infrastructure/adapters/airtel-signing.service';
import { RailRouterService } from './infrastructure/rail-router.service';
import { PrismaTransactionRepository } from './infrastructure/prisma-transaction.repository';
import { TRANSACTION_REPOSITORY } from './domain/ports/transaction-repository.interface';
import { IdentityModule } from '../identity/identity.module';

const CommandHandlers = [
  InitiatePaymentHandler,
  SettlePaymentHandler,
  FailPaymentHandler,
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    IdentityModule,
    BullModule.registerQueue(
      { name: 'payment-callbacks' },
      { name: 'payment-polling' },
    ),
  ],
  controllers: [CallbackController, PaymentController],
  providers: [
    ...CommandHandlers,
    DepositCallbackProcessor,
    PollingProcessor,
    PawaPayAdapter,
    TnmAdapter,
    AirtelSigningService,
    AirtelAdapter,
    RailRouterService,
    { provide: TRANSACTION_REPOSITORY, useClass: PrismaTransactionRepository },
  ],
  exports: [TRANSACTION_REPOSITORY, RailRouterService, PawaPayAdapter],
})
export class PaymentModule {}
