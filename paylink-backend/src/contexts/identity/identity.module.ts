import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './interface/auth.controller';
import { RegisterMerchantHandler } from './application/commands/register-merchant.handler';
import { LoginHandler } from './application/commands/login.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { GetMerchantHandler } from './application/queries/get-merchant.handler';
import { PrismaMerchantRepository } from './infrastructure/prisma-merchant.repository';
import { BcryptAdapter } from './infrastructure/bcrypt.adapter';
import { JwtAdapter } from './infrastructure/jwt.adapter';
import { MERCHANT_REPOSITORY } from './domain/ports/merchant-repository.interface';

const CommandHandlers = [
  RegisterMerchantHandler,
  LoginHandler,
  RefreshTokenHandler,
];
const QueryHandlers = [GetMerchantHandler];

@Module({
  imports: [CqrsModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BcryptAdapter,
    JwtAdapter,
    { provide: MERCHANT_REPOSITORY, useClass: PrismaMerchantRepository },
  ],
  exports: [MERCHANT_REPOSITORY, JwtAdapter],
})
export class IdentityModule {}
