import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RailRouterService } from '../../infrastructure/rail-router.service';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/ports/transaction-repository.interface';
import { SettlePaymentCommand } from '../commands/settle-payment.command';
import { FailPaymentCommand } from '../commands/fail-payment.command';

@Processor('payment-polling')
export class PollingProcessor extends WorkerHost {
  private readonly logger = new Logger(PollingProcessor.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly railRouter: RailRouterService,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
  ) {
    super();
  }

  async process(job: Job<{ transactionId: string }>): Promise<void> {
    const { transactionId } = job.data;
    const txn = await this.repo.findById(transactionId);

    if (!txn || txn.status !== 'PENDING') return; // Already resolved

    this.logger.warn(
      `[POLLING] callback not received for depositId=${transactionId}, polling PawaPay`,
    );

    const adapter = this.railRouter.getAdapter(txn.rail);
    if (!txn.externalRef) {
      await this.commandBus.execute(
        new FailPaymentCommand(transactionId, 'NO_EXTERNAL_REF'),
      );
      return;
    }

    const status = await adapter.getDepositStatus(txn.externalRef);
    if (status === 'COMPLETED') {
      await this.commandBus.execute(
        new SettlePaymentCommand(transactionId, txn.externalRef),
      );
    } else if (status === 'FAILED') {
      await this.commandBus.execute(new FailPaymentCommand(transactionId));
    }
    // PENDING: leave for another cycle
  }
}
