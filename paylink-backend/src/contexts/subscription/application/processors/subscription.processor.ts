import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { SubscriptionSchedule } from '../../domain/subscription-schedule.aggregate';
import { InitiatePaymentCommand } from '@contexts/payment/application/commands/initiate-payment.command';

@Processor('subscription')
export class SubscriptionProcessor extends WorkerHost {
  private readonly logger = new Logger(SubscriptionProcessor.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly prisma: PrismaService,
    @InjectQueue('subscription') private readonly subscriptionQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<{ subscriptionId: string }>): Promise<void> {
    const { subscriptionId } = job.data;
    const row = await this.prisma.subscriptionSchedule.findUnique({
      where: { id: subscriptionId },
    });
    if (!row) return;

    const sub = SubscriptionSchedule.reconstitute({
      id: row.id,
      linkId: row.linkId,
      payerAccountId: row.payerAccountId,
      status: row.status as 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED',
      interval: row.interval as 'WEEKLY' | 'MONTHLY',
      nextDueAt: row.nextDueAt,
      retryCount: row.retryCount,
      cyclesCompleted: row.cyclesCompleted,
      maxCycles: row.maxCycles,
    });

    if (job.name === 'schedule-next-cycle') {
      sub.onPaymentSuccess();
    } else if (job.name === 'trigger-retry') {
      const { nextRetryAt } = sub.onPaymentFailed();

      if (nextRetryAt) {
        // Schedule retry payment at nextRetryAt
        const delay = nextRetryAt.getTime() - Date.now();
        await this.subscriptionQueue.add(
          'initiate-payment',
          {
            subscriptionId,
            linkId: sub.linkId,
            payerAccountId: sub.payerAccountId,
          },
          { delay: Math.max(0, delay) },
        );
      }
    } else if (job.name === 'initiate-payment') {
      const link = await this.prisma.paymentLink.findUnique({
        where: { id: sub.linkId },
      });
      if (!link) return;
      await this.commandBus.execute(
        new InitiatePaymentCommand(link.slug, null, null, null),
      );
    }

    // Persist state changes
    await this.prisma.subscriptionSchedule.update({
      where: { id: sub.id },
      data: {
        status: sub.status,
        retryCount: sub.retryCount,
        cyclesCompleted: sub.cyclesCompleted,
        nextDueAt: sub.nextDueAt,
      },
    });

    for (const event of sub.domainEvents) {
      this.eventBus.publish(event);
    }
    sub.clearEvents();
  }
}
