import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IPayerRepository } from '../domain/ports/payer-repository.interface';
import { PayerAccount } from '../domain/payer-account.aggregate';
import { PayerId } from '@shared/domain/payer-id.vo';
import { EncryptedMsisdn } from '../domain/encrypted-msisdn.vo';

@Injectable()
export class PrismaPayerRepository implements IPayerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: PayerId): Promise<PayerAccount | null> {
    const row = await this.prisma.payerAccount.findUnique({
      where: { id: id.value },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<PayerAccount | null> {
    const row = await this.prisma.payerAccount.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async findByMsisdnHash(hash: string): Promise<PayerAccount | null> {
    const row = await this.prisma.payerAccount.findUnique({
      where: { msisdnHash: hash },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(payer: PayerAccount): Promise<void> {
    await this.prisma.payerAccount.upsert({
      where: { id: payer.id.value },
      create: {
        id: payer.id.value,
        email: payer.email,
        msisdnEncrypted: payer.msisdnEncrypted.toStorageString(),
        msisdnHash: payer.msisdnHash,
        msisdnHint: payer.msisdnHint,
        preferredRail: payer.preferredRail,
        preferredProvider: payer.preferredProvider,
        verified: payer.verified,
        fcmToken: payer.fcmToken,
      },
      update: {
        verified: payer.verified,
        fcmToken: payer.fcmToken,
        preferredRail: payer.preferredRail,
        preferredProvider: payer.preferredProvider,
      },
    });
  }

  private toDomain(row: {
    id: string;
    email: string;
    msisdnEncrypted: string;
    msisdnHash: string;
    msisdnHint: string;
    preferredRail: string;
    preferredProvider: string;
    verified: boolean;
    fcmToken: string | null;
  }): PayerAccount {
    return PayerAccount.reconstitute({
      id: PayerId.create(row.id),
      email: row.email,
      msisdnEncrypted: EncryptedMsisdn.fromString(row.msisdnEncrypted),
      msisdnHash: row.msisdnHash,
      msisdnHint: row.msisdnHint,
      preferredRail: row.preferredRail,
      preferredProvider: row.preferredProvider,
      verified: row.verified,
      fcmToken: row.fcmToken,
    });
  }
}
