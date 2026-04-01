import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateFcmTokenCommand } from './update-fcm-token.command';
import {
  IPayerRepository,
  PAYER_REPOSITORY,
} from '../../domain/ports/payer-repository.interface';
import { PayerId } from '@shared/domain/payer-id.vo';
import { NotFoundError } from '@shared/errors/not-found.error';

@CommandHandler(UpdateFcmTokenCommand)
export class UpdateFcmTokenHandler implements ICommandHandler<UpdateFcmTokenCommand> {
  constructor(
    @Inject(PAYER_REPOSITORY) private readonly repo: IPayerRepository,
  ) {}

  async execute(cmd: UpdateFcmTokenCommand): Promise<void> {
    const payer = await this.repo.findById(PayerId.create(cmd.payerId));
    if (!payer) throw new NotFoundError('PayerAccount', cmd.payerId);
    payer.updateFcmToken(cmd.fcmToken);
    await this.repo.save(payer);
  }
}
