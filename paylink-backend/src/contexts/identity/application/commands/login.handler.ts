import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { LoginCommand, LoginResult } from './login.command';
import {
  IMerchantRepository,
  MERCHANT_REPOSITORY,
} from '../../domain/ports/merchant-repository.interface';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';
import { BcryptAdapter } from '../../infrastructure/bcrypt.adapter';
import { JwtAdapter } from '../../infrastructure/jwt.adapter';

/**
 * @description Handles merchant login. Returns JWT access + refresh token pair.
 * @throws UnauthorisedError for invalid credentials
 */
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repo: IMerchantRepository,
    private readonly bcrypt: BcryptAdapter,
    private readonly jwt: JwtAdapter,
  ) {}

  async execute(cmd: LoginCommand): Promise<LoginResult> {
    const merchant = await this.repo.findByEmail(cmd.email);
    if (!merchant) throw new UnauthorisedError('Invalid credentials');

    const valid = await this.bcrypt.compare(
      cmd.password,
      merchant.passwordHash,
    );
    if (!valid) throw new UnauthorisedError('Invalid credentials');

    const tokens = this.jwt.signPair({
      sub: merchant.id.value,
      email: merchant.email,
    });
    this.logger.log(`Merchant logged in: ${merchant.id.value}`);
    return { ...tokens, merchantId: merchant.id.value };
  }
}
