import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RegisterMerchantCommand } from './register-merchant.command';
import {
  IMerchantRepository,
  MERCHANT_REPOSITORY,
} from '../../domain/ports/merchant-repository.interface';
import { Merchant } from '../../domain/merchant.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { ConflictError } from '@shared/errors/conflict.error';
import { BcryptAdapter } from '../../infrastructure/bcrypt.adapter';

/**
 * @description Handles merchant registration.
 * @throws ConflictError if email already registered
 */
@CommandHandler(RegisterMerchantCommand)
export class RegisterMerchantHandler implements ICommandHandler<RegisterMerchantCommand> {
  private readonly logger = new Logger(RegisterMerchantHandler.name);

  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repo: IMerchantRepository,
    private readonly bcrypt: BcryptAdapter,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: RegisterMerchantCommand): Promise<{ id: string }> {
    const existing = await this.repo.findByEmail(cmd.email);
    if (existing)
      throw new ConflictError(`Email already registered: ${cmd.email}`);

    const passwordHash = await this.bcrypt.hash(cmd.password);
    const merchant = Merchant.register({
      id: MerchantId.create(),
      email: cmd.email,
      businessName: cmd.businessName,
      passwordHash,
    });

    await this.repo.save(merchant);
    this.logger.log(`Merchant registered: ${merchant.id.value}`);

    for (const event of merchant.domainEvents) {
      this.eventBus.publish(event);
    }
    merchant.clearEvents();

    return { id: merchant.id.value };
  }
}
