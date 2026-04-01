import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IRefundRepository } from '../domain/ports/refund-repository.interface';
import { Refund, RefundStatus } from '../domain/refund.aggregate';
import { Money } from '@shared/domain/money.vo';

@Injectable()
export class PrismaRefundRepository implements IRefundRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Refund | null> {
    const row = await this.prisma.refund.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByExternalRef(externalRef: string): Promise<Refund | null> {
    const row = await this.prisma.refund.findUnique({ where: { externalRef } });
    return row ? this.toDomain(row) : null;
  }

  async findByTransactionId(transactionId: string): Promise<Refund[]> {
    const rows = await this.prisma.refund.findMany({
      where: { transactionId },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByMerchant(merchantId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.refund.findMany({
        where: { merchantId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.refund.count({ where: { merchantId } }),
    ]);
    return { items: items.map((r) => this.toDomain(r)), total };
  }

  async save(refund: Refund): Promise<void> {
    await this.prisma.refund.upsert({
      where: { id: refund.id },
      create: {
        id: refund.id,
        transactionId: refund.transactionId,
        merchantId: refund.merchantId,
        amount: new Decimal(refund.amount.toString()),
        currency: refund.currency,
        status: refund.status,
        rail: refund.rail,
        externalRef: refund.externalRef,
        reason: refund.reason,
        resolvedAt: refund.resolvedAt,
      },
      update: {
        status: refund.status,
        externalRef: refund.externalRef,
        resolvedAt: refund.resolvedAt,
      },
    });
  }

  private toDomain(row: {
    id: string;
    transactionId: string;
    merchantId: string;
    amount: Decimal;
    currency: string;
    status: string;
    rail: string;
    externalRef: string | null;
    reason: string;
    resolvedAt: Date | null;
  }): Refund {
    // depositId is not stored on Refund row — it's on the Transaction
    // We store it in externalRef flow. Use transactionId as fallback for depositId field.
    return Refund.reconstitute({
      id: row.id,
      transactionId: row.transactionId,
      merchantId: row.merchantId,
      depositId: row.externalRef ?? row.transactionId,
      amount: Money.fromDecimal(row.amount, row.currency),
      currency: row.currency,
      status: row.status as RefundStatus,
      rail: row.rail,
      externalRef: row.externalRef,
      reason: row.reason,
      resolvedAt: row.resolvedAt,
    });
  }
}
