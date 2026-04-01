import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CommandBus } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/ports/refund-repository.interface';
import { RailRouterService } from '@contexts/payment/infrastructure/rail-router.service';
import { CompleteRefundCommand } from '../commands/complete-refund.command';
import { FailRefundCommand } from '../commands/fail-refund.command';

@Processor('refund-polling')
export class RefundPollingProcessor extends WorkerHost {
  private readonly logger = new Logger(RefundPollingProcessor.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly railRouter: RailRouterService,
    @Inject(REFUND_REPOSITORY) private readonly repo: IRefundRepository,
  ) {
    super();
  }

  async process(job: Job<{ refundId: string }>): Promise<void> {
    const refund = await this.repo.findById(job.data.refundId);
    if (!refund || refund.status !== 'PENDING' || !refund.externalRef) return;

    this.logger.warn(
      `[POLLING] callback not received for refundId=${refund.id}, polling PawaPay`,
    );
    const adapter = this.railRouter.getAdapter(refund.rail);
    const status = await adapter.getRefundStatus(refund.externalRef);

    if (status === 'COMPLETED') {
      await this.commandBus.execute(
        new CompleteRefundCommand(refund.externalRef),
      );
    } else if (status === 'FAILED') {
      await this.commandBus.execute(
        new FailRefundCommand(refund.externalRef, 'POLLING_FAILED'),
      );
    }
  }
}
