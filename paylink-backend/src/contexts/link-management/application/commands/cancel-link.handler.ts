import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CancelLinkCommand } from './cancel-link.command';
import {
  ILinkRepository,
  LINK_REPOSITORY,
} from '../../domain/ports/link-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

@CommandHandler(CancelLinkCommand)
export class CancelLinkHandler implements ICommandHandler<CancelLinkCommand> {
  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CancelLinkCommand): Promise<void> {
    const link = await this.repo.findById(cmd.linkId);
    if (!link) throw new NotFoundError('PaymentLink', cmd.linkId);
    if (link.merchantId.value !== cmd.merchantId)
      throw new UnauthorisedError('Not your link');
    link.cancel();
    await this.repo.save(link);
    for (const event of link.domainEvents) {
      this.eventBus.publish(event);
    }
    link.clearEvents();
  }
}
