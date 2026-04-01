import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  PaymentSettledEvent,
  PaymentFailedEvent,
} from '@contexts/payment/domain/transaction.aggregate';
import {
  RefundCompletedEvent,
  RefundFailedEvent,
  RefundInitiatedEvent,
} from '@contexts/refund/domain/refund.aggregate';

@Injectable()
export class NotificationListeners {
  private readonly logger = new Logger(NotificationListeners.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('push') private readonly pushQueue: Queue,
    @InjectQueue('webhook-dispatch') private readonly webhookQueue: Queue,
  ) {}

  @OnEvent('payment.settled')
  async onPaymentSettled(event: PaymentSettledEvent): Promise<void> {
    await this.emailQueue.add('send-receipt-email', {
      transactionId: event.transactionId,
      merchantId: event.merchantId,
    });
    await this.pushQueue.add('send-push', {
      type: 'payment_settled',
      transactionId: event.transactionId,
      merchantId: event.merchantId,
    });
    await this.webhookQueue.add('dispatch-merchant-webhook', {
      transactionId: event.transactionId,
      merchantId: event.merchantId,
    });
  }

  @OnEvent('payment.failed')
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    await this.pushQueue.add('send-push', {
      type: 'payment_failed',
      transactionId: event.transactionId,
    });
  }

  @OnEvent('refund.initiated')
  async onRefundInitiated(event: RefundInitiatedEvent): Promise<void> {
    await this.emailQueue.add('send-refund-initiated-email', {
      refundId: event.refundId,
      transactionId: event.transactionId,
    });
    await this.pushQueue.add('send-push', {
      type: 'refund_initiated',
      refundId: event.refundId,
    });
  }

  @OnEvent('refund.completed')
  async onRefundCompleted(event: RefundCompletedEvent): Promise<void> {
    await this.emailQueue.add('send-refund-completed-email', {
      refundId: event.refundId,
      merchantId: event.merchantId,
    });
    await this.pushQueue.add('send-push', {
      type: 'refund_completed',
      refundId: event.refundId,
    });
  }

  @OnEvent('refund.failed')
  async onRefundFailed(event: RefundFailedEvent): Promise<void> {
    await this.emailQueue.add('send-refund-failed-email', {
      refundId: event.refundId,
    });
  }
}
