import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ExpireLinkCommand } from './expire-link.command';
import {
  ILinkRepository,
  LINK_REPOSITORY,
} from '../../domain/ports/link-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';

@CommandHandler(ExpireLinkCommand)
export class ExpireLinkHandler implements ICommandHandler<ExpireLinkCommand> {
  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: ExpireLinkCommand): Promise<void> {
    const link = await this.repo.findById(cmd.linkId);
    if (!link) throw new NotFoundError('PaymentLink', cmd.linkId);
    link.expire();
    await this.repo.save(link);
    for (const event of link.domainEvents) {
      this.eventBus.publish(event);
    }
    link.clearEvents();
  }
}
