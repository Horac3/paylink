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

/** Rails that rely entirely on polling — no inbound webhooks. */
const POLLING_RAILS = new Set(['TNM', 'AIRTEL']);

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

  async process(job: Job<{ transactionId: string; rail?: string }>): Promise<void> {
    const { transactionId } = job.data;
    const txn = await this.repo.findById(transactionId);

    if (!txn || txn.status !== 'PENDING') return; // Already resolved

    this.logger.warn(
      `[POLLING] Polling rail=${txn.rail} for transactionId=${transactionId} attempt=${job.attemptsMade + 1}`,
    );

    const adapter = this.railRouter.getAdapter(txn.rail);
    if (!txn.externalRef) {
      await this.commandBus.execute(
        new FailPaymentCommand(transactionId, 'NO_EXTERNAL_REF'),
      );
      return;
    }

    const result = await adapter.getDepositStatus(txn.externalRef);

    if (result.status === 'COMPLETED') {
      await this.commandBus.execute(
        new SettlePaymentCommand(
          transactionId,
          txn.externalRef,
          result.receiptNumber,
          result.externalProviderRef,
        ),
      );
    } else if (result.status === 'FAILED') {
      await this.commandBus.execute(new FailPaymentCommand(transactionId));
    } else {
      // PENDING
      if (POLLING_RAILS.has(txn.rail)) {
        // Throw so BullMQ retries according to job's backoff/attempts config
        throw new Error(`[POLLING] Transaction ${transactionId} still PENDING on ${txn.rail} — retrying`);
      }
      // Callback-based rail (PawaPay): log and exit — callback will arrive (or already did)
      this.logger.warn(
        `[POLLING] PawaPay transaction ${transactionId} still PENDING after failsafe — no further action`,
      );
    }
  }
}
