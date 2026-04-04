import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IRecipientTokenRepository } from '../domain/ports/recipient-token-repository.interface';
import { RecipientToken } from '../domain/recipient-token.entity';

@Injectable()
export class PrismaRecipientTokenRepository implements IRecipientTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(token: RecipientToken): Promise<void> {
    await this.prisma.recipientToken.upsert({
      where: { id: token.id },
      create: {
        id: token.id,
        linkId: token.linkId,
        encryptedMsisdn: token.encryptedMsisdn,
        providerCode: token.providerCode,
        expiresAt: token.expiresAt,
        used: token.used,
        usedAt: token.usedAt,
      },
      update: {
        used: token.used,
        usedAt: token.usedAt,
      },
    });
  }

  async findById(id: string): Promise<RecipientToken | null> {
    const row = await this.prisma.recipientToken.findUnique({ where: { id } });
    if (!row) return null;
    return new RecipientToken(
      row.id,
      row.linkId,
      row.encryptedMsisdn,
      row.providerCode,
      row.expiresAt,
      row.used,
      row.usedAt,
      row.createdAt,
    );
  }

  async markUsed(id: string): Promise<void> {
    await this.prisma.recipientToken.update({
      where: { id },
      data: { used: true, usedAt: new Date() },
    });
  }
}
