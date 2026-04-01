import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  PaymentSettledEvent,
  PaymentFailedEvent,
} from '@contexts/payment/domain/transaction.aggregate';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@Injectable()
export class SubscriptionListeners {
  private readonly logger = new Logger(SubscriptionListeners.name);

  constructor(
    @InjectQueue('subscription') private readonly subscriptionQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('payment.settled')
  async onPaymentSettled(event: PaymentSettledEvent): Promise<void> {
    // Find subscription for this link/payer combo
    const txn = await this.prisma.transaction.findUnique({
      where: { id: event.transactionId },
      include: { link: true },
    });
    if (!txn || txn.link.type !== 'SUBSCRIPTION' || !txn.payerAccountId) return;

    const sub = await this.prisma.subscriptionSchedule.findFirst({
      where: {
        linkId: txn.linkId,
        payerAccountId: txn.payerAccountId,
        status: 'ACTIVE',
      },
    });
    if (!sub) return;

    await this.subscriptionQueue.add('schedule-next-cycle', {
      subscriptionId: sub.id,
    });
  }

  @OnEvent('payment.failed')
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const txn = await this.prisma.transaction.findUnique({
      where: { id: event.transactionId },
      include: { link: true },
    });
    if (!txn || txn.link.type !== 'SUBSCRIPTION' || !txn.payerAccountId) return;

    const sub = await this.prisma.subscriptionSchedule.findFirst({
      where: {
        linkId: txn.linkId,
        payerAccountId: txn.payerAccountId,
        status: 'ACTIVE',
      },
    });
    if (!sub) return;

    await this.subscriptionQueue.add('trigger-retry', {
      subscriptionId: sub.id,
    });
  }
}
