import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CreateRecipientTokenCommand } from './create-recipient-token.command';
import { RecipientTokenService } from '../../infrastructure/recipient-token.service';
import {
  IRecipientTokenRepository,
  RECIPIENT_TOKEN_REPOSITORY,
} from '../../domain/ports/recipient-token-repository.interface';
import { RecipientToken } from '../../domain/recipient-token.entity';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DomainError } from '@shared/errors/domain.error';

/** Detect PawaPay providerCode from Malawian MSISDN prefix. */
function detectProviderFromMsisdn(msisdn: string): string | null {
  const local = msisdn.replace(/^(\+265|265)/, '');
  if (local.startsWith('88') || local.startsWith('89') || local.startsWith('99')) return 'TNM_MWI';
  if (['75', '76', '77', '78', '97'].some((p) => local.startsWith(p))) return 'AIRTEL_MWI';
  return null;
}

export interface CreateRecipientTokenResult {
  recipientPaymentUrl: string;
}

@CommandHandler(CreateRecipientTokenCommand)
export class CreateRecipientTokenHandler
  implements ICommandHandler<CreateRecipientTokenCommand, CreateRecipientTokenResult>
{
  private readonly logger = new Logger(CreateRecipientTokenHandler.name);

  constructor(
    private readonly recipientTokenService: RecipientTokenService,
    @Inject(RECIPIENT_TOKEN_REPOSITORY)
    private readonly recipientTokenRepo: IRecipientTokenRepository,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async execute(cmd: CreateRecipientTokenCommand): Promise<CreateRecipientTokenResult> {
    // 1. Detect/validate provider code
    const providerCode = cmd.providerCode ?? detectProviderFromMsisdn(cmd.msisdn);
    if (!providerCode) {
      throw new DomainError('Could not detect mobile network from MSISDN prefix');
    }

    // 2. Encrypt MSISDN — never stored in plain text
    const encryptedMsisdn = this.recipientTokenService.encrypt(cmd.msisdn);

    // 3. Calculate expiry
    const expiryHours = this.config.get<number>('RECIPIENT_TOKEN_EXPIRY_HOURS', 72);
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // 4. Persist token record
    const token = new RecipientToken(
      uuidv4(),
      cmd.linkId,
      encryptedMsisdn,
      providerCode,
      expiresAt,
      false,
      null,
      new Date(),
    );
    await this.recipientTokenRepo.save(token);

    // 5. Mark link as having a recipient token
    await this.prisma.paymentLink.update({
      where: { id: cmd.linkId },
      data: { hasRecipientToken: true },
    });

    // 6. Sign JWT carrying only the token ID
    const signed = this.recipientTokenService.sign(token.id, token.expiresAt);

    const webUrl = this.config.getOrThrow<string>('WEB_URL');
    const recipientPaymentUrl = `${webUrl}/pay/${cmd.linkSlug}?r=${signed}`;

    this.logger.log(`RecipientToken created: ${token.id} for link ${cmd.linkId}`);

    return { recipientPaymentUrl };
  }
}
