import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { JwtAdapter } from '../../infrastructure/jwt.adapter';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(private readonly jwt: JwtAdapter) {}

  async execute(
    cmd: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwt.verifyRefresh(cmd.refreshToken);
      return this.jwt.signPair({ sub: payload.sub, email: payload.email });
    } catch {
      throw new UnauthorisedError('Invalid or expired refresh token');
    }
  }
}
