import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ITransactionRepository } from '../domain/ports/transaction-repository.interface';
import { Transaction, TxnStatus } from '../domain/transaction.aggregate';
import { Money } from '@shared/domain/money.vo';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    const row = await this.prisma.transaction.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByExternalRef(externalRef: string): Promise<Transaction | null> {
    const row = await this.prisma.transaction.findUnique({
      where: { externalRef },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(txn: Transaction): Promise<void> {
    await this.prisma.transaction.upsert({
      where: { id: txn.id },
      create: {
        id: txn.id,
        linkId: txn.linkId,
        merchantId: txn.merchantId,
        payerAccountId: txn.payerAccountId,
        grossAmount: new Decimal(txn.grossAmount.toString()),
        feeRate: new Decimal(txn.feeRate),
        feeAmount: new Decimal(txn.feeAmount.toString()),
        netAmount: new Decimal(txn.netAmount.toString()),
        rail: txn.rail,
        providerCode: txn.providerCode,
        externalRef: txn.externalRef,
        status: txn.status,
        webhookDelivered: txn.webhookDelivered,
      },
      update: {
        status: txn.status,
        externalRef: txn.externalRef,
        receiptNumber: txn.receiptNumber,
        externalProviderRef: txn.externalProviderRef,
        webhookDelivered: txn.webhookDelivered,
      },
    });
  }

  private toDomain(row: {
    id: string;
    linkId: string;
    merchantId: string;
    payerAccountId: string | null;
    grossAmount: Decimal;
    feeRate: Decimal;
    feeAmount: Decimal;
    netAmount: Decimal;
    rail: string;
    providerCode: string;
    externalRef: string | null;
    receiptNumber: string | null;
    externalProviderRef: string | null;
    status: string;
    webhookDelivered: boolean;
  }): Transaction {
    return Transaction.reconstitute({
      id: row.id,
      linkId: row.linkId,
      merchantId: row.merchantId,
      payerAccountId: row.payerAccountId,
      grossAmount: Money.fromDecimal(row.grossAmount, 'MWK'),
      feeRate: row.feeRate.toString(),
      feeAmount: Money.fromDecimal(row.feeAmount, 'MWK'),
      netAmount: Money.fromDecimal(row.netAmount, 'MWK'),
      rail: row.rail,
      providerCode: row.providerCode,
      externalRef: row.externalRef,
      receiptNumber: row.receiptNumber,
      externalProviderRef: row.externalProviderRef,
      status: row.status as TxnStatus,
      webhookDelivered: row.webhookDelivered,
    });
  }
}
