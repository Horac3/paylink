import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SettlePaymentCommand } from '../commands/settle-payment.command';
import { FailPaymentCommand } from '../commands/fail-payment.command';

interface DepositCallbackJob {
  depositId: string;
  status: 'COMPLETED' | 'FAILED';
  externalRef: string;
  failureCode?: string;
}

@Processor('payment-callbacks')
export class DepositCallbackProcessor extends WorkerHost {
  private readonly logger = new Logger(DepositCallbackProcessor.name);

  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async process(job: Job<DepositCallbackJob>): Promise<void> {
    const { depositId, status, externalRef, failureCode } = job.data;
    this.logger.log(
      `Processing deposit callback: ${depositId} status=${status}`,
    );

    if (status === 'COMPLETED') {
      await this.commandBus.execute(
        new SettlePaymentCommand(depositId, externalRef),
      );
    } else {
      await this.commandBus.execute(
        new FailPaymentCommand(depositId, failureCode),
      );
    }
  }
}
