import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { CompleteRefundCommand } from './complete-refund.command';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/ports/refund-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';

@CommandHandler(CompleteRefundCommand)
export class CompleteRefundHandler implements ICommandHandler<CompleteRefundCommand> {
  private readonly logger = new Logger(CompleteRefundHandler.name);

  constructor(
    @Inject(REFUND_REPOSITORY) private readonly repo: IRefundRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CompleteRefundCommand): Promise<void> {
    const refund = await this.repo.findByExternalRef(cmd.externalRef);
    if (!refund) throw new NotFoundError('Refund', cmd.externalRef);

    // Idempotency
    if (refund.status === 'COMPLETED') {
      this.logger.log(`Idempotent — refund already COMPLETED: ${refund.id}`);
      return;
    }

    refund.complete();
    await this.repo.save(refund);
    for (const event of refund.domainEvents) {
      this.eventBus.publish(event);
    }
    refund.clearEvents();
    this.logger.log(`Refund completed: ${refund.id}`);
  }
}
