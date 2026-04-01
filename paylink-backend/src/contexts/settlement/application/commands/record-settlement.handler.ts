import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RecordSettlementCommand } from './record-settlement.command';
import {
  IFeeEntryRepository,
  FEE_ENTRY_REPOSITORY,
} from '../../domain/ports/fee-entry-repository.interface';
import { Money } from '@shared/domain/money.vo';
import { FeeTier, FeeTierHelper } from '@shared/domain/fee-tier.vo';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@CommandHandler(RecordSettlementCommand)
export class RecordSettlementHandler implements ICommandHandler<RecordSettlementCommand> {
  private readonly logger = new Logger(RecordSettlementHandler.name);

  constructor(
    @Inject(FEE_ENTRY_REPOSITORY) private readonly repo: IFeeEntryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(cmd: RecordSettlementCommand): Promise<void> {
    // Idempotency: skip if already recorded
    const existing = await this.repo.findByTransactionId(cmd.transactionId);
    if (existing) return;

    const merchant = await this.prisma.merchant.findUnique({
      where: { id: cmd.merchantId },
    });
    const feeTier = (merchant?.feeTier ?? 'STARTER') as FeeTier;
    const feeRate = FeeTierHelper.rateFor(feeTier);

    const gross = Money.of(cmd.amount, cmd.currency);
    const feeAmount = gross.multiplyByRate(feeRate);
    const netAmount = gross.subtract(feeAmount);

    await this.repo.save({
      id: uuidv4(),
      transactionId: cmd.transactionId,
      merchantId: cmd.merchantId,
      grossAmount: gross,
      feeRate: feeRate.toString(),
      feeAmount,
      netAmount,
      type: 'CHARGE',
      refId: null,
    });

    this.logger.log(
      `Settlement recorded: txn=${cmd.transactionId} fee=${feeAmount.toString()} net=${netAmount.toString()}`,
    );
  }
}
