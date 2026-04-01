import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import {
  PaymentInitiatedEvent,
  PaymentSettledEvent,
  PaymentFailedEvent,
} from '@contexts/payment/domain/transaction.aggregate';
import { RefundCompletedEvent } from '@contexts/refund/domain/refund.aggregate';

@Injectable()
export class AnalyticsListeners {
  private readonly logger = new Logger(AnalyticsListeners.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('payment.initiated')
  async onPaymentInitiated(event: PaymentInitiatedEvent): Promise<void> {
    await this.appendEvent(event.linkId, 'PAY_STARTED');
    await this.rebuildSnapshot(event.linkId);
  }

  @OnEvent('payment.settled')
  async onPaymentSettled(event: PaymentSettledEvent): Promise<void> {
    const txn = await this.prisma.transaction.findUnique({
      where: { id: event.transactionId },
    });
    if (txn) {
      await this.appendEvent(txn.linkId, 'CONVERTED', {
        amount: txn.grossAmount.toString(),
      });
      await this.rebuildSnapshot(txn.linkId);
    }
  }

  @OnEvent('payment.failed')
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const txn = await this.prisma.transaction.findUnique({
      where: { id: event.transactionId },
    });
    if (txn) {
      await this.appendEvent(txn.linkId, 'PAY_FAILED');
      await this.rebuildSnapshot(txn.linkId);
    }
  }

  @OnEvent('refund.completed')
  async onRefundCompleted(event: RefundCompletedEvent): Promise<void> {
    const txn = await this.prisma.transaction.findUnique({
      where: { id: event.transactionId },
    });
    if (txn) {
      await this.appendEvent(txn.linkId, 'REFUNDED');
      await this.rebuildSnapshot(txn.linkId);
    }
  }

  private async appendEvent(
    linkId: string,
    type: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.prisma.linkEvent.create({
        data: {
          linkId,
          type,
          metadata: (metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        },
      });
    } catch (err) {
      this.logger.error(
        `Failed to append analytics event: ${(err as Error).message}`,
      );
    }
  }

  private async rebuildSnapshot(linkId: string): Promise<void> {
    try {
      const events = await this.prisma.linkEvent.findMany({
        where: { linkId },
      });
      const paymentStarts = events.filter(
        (e) => e.type === 'PAY_STARTED',
      ).length;
      const conversions = events.filter((e) => e.type === 'CONVERTED').length;
      const failures = events.filter((e) => e.type === 'PAY_FAILED').length;
      const refunds = events.filter((e) => e.type === 'REFUNDED').length;
      const conversionRate =
        paymentStarts > 0 ? conversions / paymentStarts : 0;

      await this.prisma.analyticsSnapshot.upsert({
        where: { linkId },
        create: {
          linkId,
          paymentStarts,
          conversions,
          failures,
          refunds,
          conversionRate,
          lastActivityAt: new Date(),
        },
        update: {
          paymentStarts,
          conversions,
          failures,
          refunds,
          conversionRate,
          lastActivityAt: new Date(),
        },
      });
    } catch (err) {
      this.logger.error(
        `Failed to rebuild snapshot: ${(err as Error).message}`,
      );
    }
  }
}
