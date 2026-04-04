import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { CallbackController } from './interface/callback.controller';
import { PaymentController } from './interface/payment.controller';
import { TransactionsController } from './interface/transactions.controller';
import { InitiatePaymentHandler } from './application/commands/initiate-payment.handler';
import { SettlePaymentHandler } from './application/commands/settle-payment.handler';
import { FailPaymentHandler } from './application/commands/fail-payment.handler';
import { CreateRecipientTokenHandler } from './application/commands/create-recipient-token.handler';
import { DepositCallbackProcessor } from './application/processors/deposit-callback.processor';
import { PollingProcessor } from './application/processors/polling.processor';
import { PawaPayAdapter } from './infrastructure/adapters/pawapay.adapter';
import { RailRouterService } from './infrastructure/rail-router.service';
import { RecipientTokenService } from './infrastructure/recipient-token.service';
import { PaymentSseService } from './infrastructure/payment-sse.service';
import { PrismaTransactionRepository } from './infrastructure/prisma-transaction.repository';
import { PrismaRecipientTokenRepository } from './infrastructure/prisma-recipient-token.repository';
import { TRANSACTION_REPOSITORY } from './domain/ports/transaction-repository.interface';
import { RECIPIENT_TOKEN_REPOSITORY } from './domain/ports/recipient-token-repository.interface';
import { IdentityModule } from '../identity/identity.module';

const CommandHandlers = [
  InitiatePaymentHandler,
  SettlePaymentHandler,
  FailPaymentHandler,
  CreateRecipientTokenHandler,
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
  controllers: [CallbackController, PaymentController, TransactionsController],
  providers: [
    ...CommandHandlers,
    DepositCallbackProcessor,
    PollingProcessor,
    PawaPayAdapter,
    RailRouterService,
    RecipientTokenService,
    PaymentSseService,
    { provide: TRANSACTION_REPOSITORY, useClass: PrismaTransactionRepository },
    { provide: RECIPIENT_TOKEN_REPOSITORY, useClass: PrismaRecipientTokenRepository },
  ],
  exports: [TRANSACTION_REPOSITORY, RailRouterService, RecipientTokenService, PawaPayAdapter],
})
export class PaymentModule {}
