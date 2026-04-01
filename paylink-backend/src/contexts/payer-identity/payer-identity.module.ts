import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { PayerController } from './interface/payer.controller';
import { RegisterPayerHandler } from './application/commands/register-payer.handler';
import { VerifyOtpHandler } from './application/commands/verify-otp.handler';
import { UpdateFcmTokenHandler } from './application/commands/update-fcm-token.handler';
import { GetPayerProfileHandler } from './application/queries/get-payer-profile.handler';
import { ResolvePayerHandler } from './application/queries/resolve-payer.handler';
import { PrismaPayerRepository } from './infrastructure/prisma-payer.repository';
import { MsisdnEncryptionService } from './infrastructure/msisdn-encryption.service';
import { PAYER_REPOSITORY } from './domain/ports/payer-repository.interface';

const CommandHandlers = [
  RegisterPayerHandler,
  VerifyOtpHandler,
  UpdateFcmTokenHandler,
];
const QueryHandlers = [GetPayerProfileHandler, ResolvePayerHandler];

@Module({
  imports: [CqrsModule, ConfigModule],
  controllers: [PayerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    MsisdnEncryptionService,
    { provide: PAYER_REPOSITORY, useClass: PrismaPayerRepository },
  ],
  exports: [PAYER_REPOSITORY, MsisdnEncryptionService, ResolvePayerHandler],
})
export class PayerIdentityModule {}
