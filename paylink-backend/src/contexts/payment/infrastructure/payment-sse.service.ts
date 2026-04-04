import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface PaymentStatusEvent {
  status: 'SUCCESS' | 'FAILED';
  reference?: string;
  failureCode?: string;
}

/**
 * Holds one RxJS Subject per pending transaction.
 * SettlePaymentHandler / FailPaymentHandler call push() to emit the final event
 * and complete the stream. The SSE endpoint subscribes to the observable.
 */
@Injectable()
export class PaymentSseService {
  private readonly logger = new Logger(PaymentSseService.name);
  private readonly subjects = new Map<string, Subject<PaymentStatusEvent>>();

  getOrCreate(txnId: string): Subject<PaymentStatusEvent> {
    if (!this.subjects.has(txnId)) {
      this.subjects.set(txnId, new Subject<PaymentStatusEvent>());
    }
    return this.subjects.get(txnId)!;
  }

  push(txnId: string, event: PaymentStatusEvent): void {
    const subject = this.subjects.get(txnId);
    if (!subject) {
      this.logger.warn(`SSE push: no active listener for txn ${txnId}`);
      return;
    }
    subject.next(event);
    subject.complete();
    this.subjects.delete(txnId);
    this.logger.debug(`SSE pushed ${event.status} for txn ${txnId}`);
  }

  remove(txnId: string): void {
    const subject = this.subjects.get(txnId);
    if (subject) {
      subject.complete();
      this.subjects.delete(txnId);
    }
  }
}
