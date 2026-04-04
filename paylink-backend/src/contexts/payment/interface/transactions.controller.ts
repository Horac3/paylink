import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../domain/ports/transaction-repository.interface';
import { Prisma } from '@prisma/client';
import { CurrentMerchant } from '@shared/decorators/current-merchant.decorator';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly txnRepo: ITransactionRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List transactions for the authenticated merchant (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'] })
  @ApiQuery({ name: 'from', required: false, description: 'ISO 8601 date' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO 8601 date' })
  async list(
    @CurrentMerchant() merchantId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const take = Math.min(+limit || 20, 100);
    const skip = ((+page || 1) - 1) * take;
    const where: Prisma.TransactionWhereInput = {
      merchantId,
      ...(status ? { status: status as Prisma.EnumTxnStatusFilter } : {}),
      ...(from || to
        ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: rows.map((t) => ({
        id: t.id,
        linkId: t.linkId,
        grossAmount: t.grossAmount.toString(),
        feeAmount: t.feeAmount.toString(),
        netAmount: t.netAmount.toString(),
        currency: 'MWK',
        rail: t.rail,
        providerCode: t.providerCode,
        status: t.status,
        externalRef: t.externalRef,
        createdAt: t.createdAt,
      })),
      meta: { page: +page || 1, limit: take, total },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single transaction by ID' })
  async getOne(@Param('id') id: string, @CurrentMerchant() merchantId: string) {
    const txn = await this.txnRepo.findById(id);
    if (!txn || txn.merchantId !== merchantId) return { error: 'NOT_FOUND' };

    // Fetch createdAt from Prisma (not on domain aggregate)
    const row = await this.prisma.transaction.findUnique({ where: { id } });

    return {
      id: txn.id,
      linkId: txn.linkId,
      grossAmount: txn.grossAmount.toString(),
      feeAmount: txn.feeAmount.toString(),
      netAmount: txn.netAmount.toString(),
      currency: txn.grossAmount.currency,
      rail: txn.rail,
      providerCode: txn.providerCode,
      status: txn.status,
      externalRef: txn.externalRef,
      receiptNumber: txn.receiptNumber,
      externalProviderRef: txn.externalProviderRef,
      createdAt: row?.createdAt,
    };
  }
}
