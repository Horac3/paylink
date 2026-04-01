import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterPayerCommand } from './register-payer.command';
import {
  IPayerRepository,
  PAYER_REPOSITORY,
} from '../../domain/ports/payer-repository.interface';
import { PayerAccount } from '../../domain/payer-account.aggregate';
import { PayerId } from '@shared/domain/payer-id.vo';
import { ConflictError } from '@shared/errors/conflict.error';
import { MsisdnEncryptionService } from '../../infrastructure/msisdn-encryption.service';

@CommandHandler(RegisterPayerCommand)
export class RegisterPayerHandler implements ICommandHandler<RegisterPayerCommand> {
  private readonly logger = new Logger(RegisterPayerHandler.name);

  constructor(
    @Inject(PAYER_REPOSITORY) private readonly repo: IPayerRepository,
    private readonly encryption: MsisdnEncryptionService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: RegisterPayerCommand): Promise<{ id: string }> {
    const existing = await this.repo.findByEmail(cmd.email);
    if (existing)
      throw new ConflictError(`Email already registered: ${cmd.email}`);

    const msisdnEncrypted = this.encryption.encrypt(cmd.msisdn);
    const msisdnHash = await bcrypt.hash(cmd.msisdn, 10);
    const msisdnHint = cmd.msisdn.slice(-4);

    const payer = PayerAccount.register({
      id: PayerId.create(),
      email: cmd.email,
      msisdnEncrypted,
      msisdnHash,
      msisdnHint,
    });

    await this.repo.save(payer);
    this.logger.log(
      `Payer registered: ${payer.id.value} msisdn hint: ****${msisdnHint}`,
    );

    for (const event of payer.domainEvents) {
      this.eventBus.publish(event);
    }
    payer.clearEvents();

    return { id: payer.id.value };
  }
}
