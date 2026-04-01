import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RecordRefundReversalCommand } from './record-refund-reversal.command';
import {
  IFeeEntryRepository,
  FEE_ENTRY_REPOSITORY,
} from '../../domain/ports/fee-entry-repository.interface';
import { Money } from '@shared/domain/money.vo';
import { FeeTier, FeeTierHelper } from '@shared/domain/fee-tier.vo';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@CommandHandler(RecordRefundReversalCommand)
export class RecordRefundReversalHandler implements ICommandHandler<RecordRefundReversalCommand> {
  private readonly logger = new Logger(RecordRefundReversalHandler.name);

  constructor(
    @Inject(FEE_ENTRY_REPOSITORY) private readonly repo: IFeeEntryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(cmd: RecordRefundReversalCommand): Promise<void> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: cmd.merchantId },
    });
    const feeTier = (merchant?.feeTier ?? 'STARTER') as FeeTier;
    const feeRate = FeeTierHelper.rateFor(feeTier);

    const refundAmount = Money.of(cmd.amount, cmd.currency);
    const feeReversal = refundAmount.multiplyByRate(feeRate);
    // netAmount for reversal: money returned to merchant = gross - fee reversal (negative net impact)
    // We store it as positive values but type=REFUND_REVERSAL marks it compensating
    await this.repo.save({
      id: uuidv4(),
      transactionId: cmd.transactionId,
      merchantId: cmd.merchantId,
      grossAmount: refundAmount,
      feeRate: feeRate.toString(),
      feeAmount: feeReversal,
      netAmount: refundAmount.subtract(feeReversal),
      type: 'REFUND_REVERSAL',
      refId: cmd.refundId,
    });

    this.logger.log(
      `Refund reversal recorded: refund=${cmd.refundId} reversal=${feeReversal.toString()}`,
    );
  }
}
