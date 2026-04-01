import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CompleteRefundCommand } from '../commands/complete-refund.command';
import { FailRefundCommand } from '../commands/fail-refund.command';

interface RefundCallbackJob {
  refundId: string;
  status: 'COMPLETED' | 'FAILED';
  failureCode?: string;
}

@Processor('payment-callbacks')
export class RefundCallbackProcessor extends WorkerHost {
  private readonly logger = new Logger(RefundCallbackProcessor.name);

  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async process(job: Job<RefundCallbackJob>): Promise<void> {
    if (job.name !== 'process-refund-callback') return;
    const { refundId, status, failureCode } = job.data;
    this.logger.log(`Processing refund callback: ${refundId} status=${status}`);
    if (status === 'COMPLETED') {
      await this.commandBus.execute(new CompleteRefundCommand(refundId));
    } else {
      await this.commandBus.execute(
        new FailRefundCommand(refundId, failureCode ?? 'UNKNOWN'),
      );
    }
  }
}
