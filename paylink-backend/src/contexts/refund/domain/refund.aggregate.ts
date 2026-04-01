import { DomainEvent } from '@shared/domain/domain-event.base';
import { Money } from '@shared/domain/money.vo';
import { DomainError } from '@shared/errors/domain.error';

export type RefundStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export class RefundInitiatedEvent extends DomainEvent {
  readonly eventType = 'refund.initiated';
  constructor(
    readonly refundId: string,
    readonly transactionId: string,
    readonly amount: string,
  ) {
    super();
  }
}
export class RefundCompletedEvent extends DomainEvent {
  readonly eventType = 'refund.completed';
  constructor(
    readonly refundId: string,
    readonly transactionId: string,
    readonly merchantId: string,
    readonly amount: string,
    readonly currency: string,
  ) {
    super();
  }
}
export class RefundFailedEvent extends DomainEvent {
  readonly eventType = 'refund.failed';
  constructor(
    readonly refundId: string,
    readonly reason: string,
  ) {
    super();
  }
}
export class RefundCancelledEvent extends DomainEvent {
  readonly eventType = 'refund.cancelled';
  constructor(readonly refundId: string) {
    super();
  }
}

export interface RefundProps {
  id: string;
  transactionId: string;
  merchantId: string;
  depositId: string;
  amount: Money;
  currency: string;
  status: RefundStatus;
  rail: string;
  externalRef: string | null;
  reason: string;
  resolvedAt: Date | null;
}

/**
 * @description Refund aggregate. Represents a refund against a completed transaction.
 * State machine: PENDING → COMPLETED | FAILED | CANCELLED
 */
export class Refund {
  private readonly _domainEvents: DomainEvent[] = [];
  private constructor(private _props: RefundProps) {}

  get id(): string {
    return this._props.id;
  }
  get transactionId(): string {
    return this._props.transactionId;
  }
  get merchantId(): string {
    return this._props.merchantId;
  }
  get depositId(): string {
    return this._props.depositId;
  }
  get amount(): Money {
    return this._props.amount;
  }
  get currency(): string {
    return this._props.currency;
  }
  get status(): RefundStatus {
    return this._props.status;
  }
  get rail(): string {
    return this._props.rail;
  }
  get externalRef(): string | null {
    return this._props.externalRef;
  }
  get reason(): string {
    return this._props.reason;
  }
  get resolvedAt(): Date | null {
    return this._props.resolvedAt;
  }
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  static create(
    props: Omit<RefundProps, 'status' | 'resolvedAt' | 'externalRef'>,
  ): Refund {
    const refund = new Refund({
      ...props,
      status: 'PENDING',
      resolvedAt: null,
      externalRef: null,
    });
    refund._domainEvents.push(
      new RefundInitiatedEvent(
        props.id,
        props.transactionId,
        props.amount.toString(),
      ),
    );
    return refund;
  }

  static reconstitute(props: RefundProps): Refund {
    return new Refund(props);
  }

  setExternalRef(ref: string): void {
    this._props = { ...this._props, externalRef: ref };
  }

  /**
   * @description Mark refund as completed.
   * @throws DomainError if not PENDING
   */
  complete(): void {
    if (this._props.status !== 'PENDING') {
      throw new DomainError(
        `Cannot complete refund in status: ${this._props.status}`,
      );
    }
    this._props = {
      ...this._props,
      status: 'COMPLETED',
      resolvedAt: new Date(),
    };
    this._domainEvents.push(
      new RefundCompletedEvent(
        this._props.id,
        this._props.transactionId,
        this._props.merchantId,
        this._props.amount.toString(),
        this._props.currency,
      ),
    );
  }

  /**
   * @description Mark refund as failed.
   * @throws DomainError if not PENDING
   */
  fail(reason: string): void {
    if (this._props.status !== 'PENDING') {
      throw new DomainError(
        `Cannot fail refund in status: ${this._props.status}`,
      );
    }
    this._props = { ...this._props, status: 'FAILED', resolvedAt: new Date() };
    this._domainEvents.push(new RefundFailedEvent(this._props.id, reason));
  }

  /**
   * @description Cancel refund — only allowed before sent to rail (no externalRef).
   * @throws DomainError if already sent to rail or not PENDING
   */
  cancel(): void {
    if (this._props.status !== 'PENDING') {
      throw new DomainError(
        `Cannot cancel refund in status: ${this._props.status}`,
      );
    }
    if (this._props.externalRef) {
      throw new DomainError('Cannot cancel refund already sent to rail');
    }
    this._props = {
      ...this._props,
      status: 'CANCELLED',
      resolvedAt: new Date(),
    };
    this._domainEvents.push(new RefundCancelledEvent(this._props.id));
  }
}
