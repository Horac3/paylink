import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { FailRefundCommand } from './fail-refund.command';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/ports/refund-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';

@CommandHandler(FailRefundCommand)
export class FailRefundHandler implements ICommandHandler<FailRefundCommand> {
  private readonly logger = new Logger(FailRefundHandler.name);

  constructor(
    @Inject(REFUND_REPOSITORY) private readonly repo: IRefundRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: FailRefundCommand): Promise<void> {
    const refund = await this.repo.findByExternalRef(cmd.externalRef);
    if (!refund) throw new NotFoundError('Refund', cmd.externalRef);
    if (refund.status === 'FAILED') return;
    refund.fail(cmd.reason);
    await this.repo.save(refund);
    for (const event of refund.domainEvents) {
      this.eventBus.publish(event);
    }
    refund.clearEvents();
    this.logger.log(`Refund failed: ${refund.id}`);
  }
}
