import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ILinkRepository } from '../domain/ports/link-repository.interface';
import {
  PaymentLink,
  LinkType,
  LinkStatus,
} from '../domain/payment-link.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { Money } from '@shared/domain/money.vo';
import { Slug } from '../domain/slug.vo';
import {
  RecurrencePolicy,
  RecurrencePolicyProps,
} from '../domain/recurrence-policy.vo';

@Injectable()
export class PrismaLinkRepository implements ILinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PaymentLink | null> {
    const row = await this.prisma.paymentLink.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<PaymentLink | null> {
    const row = await this.prisma.paymentLink.findUnique({ where: { slug } });
    return row ? this.toDomain(row) : null;
  }

  async findByMerchant(merchantId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.paymentLink.findMany({
        where: { merchantId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paymentLink.count({ where: { merchantId } }),
    ]);
    return { items: items.map((r) => this.toDomain(r)), total };
  }

  async save(link: PaymentLink): Promise<void> {
    const data = {
      merchantId: link.merchantId.value,
      slug: link.slug.value,
      type: link.type,
      amount: link.amount ? new Decimal(link.amount.toString()) : null,
      currency: link.currency,
      status: link.status,
      recurrenceConfig: link.recurrencePolicy
        ? (link.recurrencePolicy.toJSON() as unknown as Prisma.InputJsonValue)
        : undefined,
      expiresAt: link.expiresAt,
      metadata: link.metadata
        ? (link.metadata as unknown as Prisma.InputJsonValue)
        : undefined,
      qrCodeBase64: link.qrCodeBase64,
    };
    await this.prisma.paymentLink.upsert({
      where: { id: link.id },
      create: { id: link.id, ...data },
      update: { status: link.status, qrCodeBase64: link.qrCodeBase64 },
    });
  }

  private toDomain(row: {
    id: string;
    merchantId: string;
    slug: string;
    type: string;
    status: string;
    amount: Decimal | null;
    currency: string;
    recurrenceConfig: unknown;
    expiresAt: Date | null;
    metadata: unknown;
    qrCodeBase64: string | null;
  }): PaymentLink {
    const recurrencePolicy = row.recurrenceConfig
      ? RecurrencePolicy.create(row.recurrenceConfig as RecurrencePolicyProps)
      : null;

    return PaymentLink.reconstitute({
      id: row.id,
      merchantId: MerchantId.create(row.merchantId),
      slug: Slug.of(row.slug),
      type: row.type as LinkType,
      status: row.status as LinkStatus,
      amount: row.amount ? Money.fromDecimal(row.amount, row.currency) : null,
      currency: row.currency,
      recurrencePolicy,
      expiresAt: row.expiresAt,
      metadata: row.metadata as Record<string, unknown> | null,
      qrCodeBase64: row.qrCodeBase64,
    });
  }
}
