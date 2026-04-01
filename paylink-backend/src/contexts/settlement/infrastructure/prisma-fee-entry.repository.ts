import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IFeeEntryRepository } from '../domain/ports/fee-entry-repository.interface';
import { FeeEntryData } from '../domain/fee-entry.value-object';
import { Money } from '@shared/domain/money.vo';

@Injectable()
export class PrismaFeeEntryRepository implements IFeeEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entry: FeeEntryData): Promise<void> {
    await this.prisma.feeEntry.create({
      data: {
        id: entry.id,
        transactionId: entry.transactionId,
        merchantId: entry.merchantId,
        grossAmount: new Decimal(entry.grossAmount.toString()),
        feeRate: new Decimal(entry.feeRate),
        feeAmount: new Decimal(entry.feeAmount.toString()),
        netAmount: new Decimal(entry.netAmount.toString()),
        type: entry.type,
        refId: entry.refId,
      },
    });
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<FeeEntryData | null> {
    const row = await this.prisma.feeEntry.findUnique({
      where: { transactionId },
    });
    if (!row) return null;
    return {
      id: row.id,
      transactionId: row.transactionId,
      merchantId: row.merchantId,
      grossAmount: Money.fromDecimal(row.grossAmount, 'MWK'),
      feeRate: row.feeRate.toString(),
      feeAmount: Money.fromDecimal(row.feeAmount, 'MWK'),
      netAmount: Money.fromDecimal(row.netAmount, 'MWK'),
      type: row.type as 'CHARGE' | 'REFUND_REVERSAL',
      refId: row.refId,
    };
  }
}
