import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IMerchantRepository } from '../domain/ports/merchant-repository.interface';
import { Merchant } from '../domain/merchant.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { FeeTier } from '@shared/domain/fee-tier.vo';

/**
 * @description Prisma implementation of IMerchantRepository.
 */
@Injectable()
export class PrismaMerchantRepository implements IMerchantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: MerchantId): Promise<Merchant | null> {
    const row = await this.prisma.merchant.findUnique({
      where: { id: id.value },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<Merchant | null> {
    const row = await this.prisma.merchant.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async save(merchant: Merchant): Promise<void> {
    await this.prisma.merchant.upsert({
      where: { id: merchant.id.value },
      create: {
        id: merchant.id.value,
        email: merchant.email,
        businessName: merchant.businessName,
        passwordHash: merchant.passwordHash,
        feeTier: merchant.feeTier,
      },
      update: {
        businessName: merchant.businessName,
        feeTier: merchant.feeTier,
      },
    });
  }

  private toDomain(row: {
    id: string;
    email: string;
    businessName: string;
    passwordHash: string;
    feeTier: string;
  }): Merchant {
    return Merchant.reconstitute({
      id: MerchantId.create(row.id),
      email: row.email,
      businessName: row.businessName,
      passwordHash: row.passwordHash,
      feeTier: row.feeTier as FeeTier,
    });
  }
}
