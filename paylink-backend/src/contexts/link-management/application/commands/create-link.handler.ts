import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateLinkCommand } from './create-link.command';
import {
  ILinkRepository,
  LINK_REPOSITORY,
} from '../../domain/ports/link-repository.interface';
import { PaymentLink } from '../../domain/payment-link.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { Money } from '@shared/domain/money.vo';
import { RecurrencePolicy } from '../../domain/recurrence-policy.vo';
import { SlugGeneratorService } from '../../infrastructure/slug-generator.service';
import { QrCodeService } from '../../infrastructure/qr-code.service';

@CommandHandler(CreateLinkCommand)
export class CreateLinkHandler implements ICommandHandler<CreateLinkCommand> {
  private readonly logger = new Logger(CreateLinkHandler.name);

  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
    private readonly slugGenerator: SlugGeneratorService,
    private readonly qrCode: QrCodeService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CreateLinkCommand): Promise<{ id: string; slug: string; url: string }> {
    const slug = await this.slugGenerator.generate();
    const amount = cmd.amount ? Money.of(cmd.amount, cmd.currency) : null;

    const recurrencePolicy = cmd.recurrenceInterval
      ? RecurrencePolicy.create({
          interval: cmd.recurrenceInterval,
          nextDueAt: new Date(),
          maxCycles: cmd.maxCycles,
        })
      : null;

    const link = PaymentLink.create({
      id: uuidv4(),
      merchantId: MerchantId.create(cmd.merchantId),
      slug,
      type: cmd.type,
      amount,
      currency: cmd.currency,
      recurrencePolicy,
      expiresAt: cmd.expiresAt,
      metadata: cmd.metadata,
    });

    const payUrl = `https://paylink.never9to5ive.com/pay/${slug.value}`;
    const qrBase64 = await this.qrCode.generate(payUrl);
    link.setQrCode(qrBase64);

    await this.repo.save(link);
    this.logger.log(`Link created: ${link.id} slug=${slug.value}`);

    for (const event of link.domainEvents) {
      this.eventBus.publish(event);
    }
    link.clearEvents();

    return { id: link.id, slug: slug.value, url: payUrl };
  }
}
