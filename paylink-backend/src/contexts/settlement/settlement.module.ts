import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RecordSettlementHandler } from './application/commands/record-settlement.handler';
import { RecordRefundReversalHandler } from './application/commands/record-refund-reversal.handler';
import { RecordSettlementListener } from './application/listeners/record-settlement.listener';
import { RecordRefundReversalListener } from './application/listeners/record-refund-reversal.listener';
import { PrismaFeeEntryRepository } from './infrastructure/prisma-fee-entry.repository';
import { FEE_ENTRY_REPOSITORY } from './domain/ports/fee-entry-repository.interface';

@Module({
  imports: [CqrsModule],
  providers: [
    RecordSettlementHandler,
    RecordRefundReversalHandler,
    RecordSettlementListener,
    RecordRefundReversalListener,
    { provide: FEE_ENTRY_REPOSITORY, useClass: PrismaFeeEntryRepository },
  ],
  exports: [FEE_ENTRY_REPOSITORY],
})
export class SettlementModule {}
