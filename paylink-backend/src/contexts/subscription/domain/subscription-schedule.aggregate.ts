import { DomainEvent } from '@shared/domain/domain-event.base';
import { RetryPolicy } from './retry-policy.vo';

export type CycleStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';

export class SubscriptionCycleCompletedEvent extends DomainEvent {
  readonly eventType = 'subscription.cycle_completed';
  constructor(
    readonly subscriptionId: string,
    readonly cyclesCompleted: number,
  ) {
    super();
  }
}
export class SubscriptionCompletedEvent extends DomainEvent {
  readonly eventType = 'subscription.completed';
  constructor(readonly subscriptionId: string) {
    super();
  }
}
export class SubscriptionRetryScheduledEvent extends DomainEvent {
  readonly eventType = 'subscription.retry_scheduled';
  constructor(
    readonly subscriptionId: string,
    readonly retryCount: number,
    readonly nextRetryAt: Date,
  ) {
    super();
  }
}
export class SubscriptionCancelledEvent extends DomainEvent {
  readonly eventType = 'subscription.cancelled';
  constructor(readonly subscriptionId: string) {
    super();
  }
}

export interface SubscriptionProps {
  id: string;
  linkId: string;
  payerAccountId: string;
  status: CycleStatus;
  interval: 'WEEKLY' | 'MONTHLY';
  nextDueAt: Date;
  retryCount: number;
  cyclesCompleted: number;
  maxCycles: number | null;
}

/**
 * @description SubscriptionSchedule aggregate. Manages recurring payment lifecycle.
 */
export class SubscriptionSchedule {
  private readonly _domainEvents: DomainEvent[] = [];
  private constructor(private _props: SubscriptionProps) {}

  get id(): string {
    return this._props.id;
  }
  get linkId(): string {
    return this._props.linkId;
  }
  get payerAccountId(): string {
    return this._props.payerAccountId;
  }
  get status(): CycleStatus {
    return this._props.status;
  }
  get interval(): 'WEEKLY' | 'MONTHLY' {
    return this._props.interval;
  }
  get nextDueAt(): Date {
    return this._props.nextDueAt;
  }
  get retryCount(): number {
    return this._props.retryCount;
  }
  get cyclesCompleted(): number {
    return this._props.cyclesCompleted;
  }
  get maxCycles(): number | null {
    return this._props.maxCycles;
  }
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  static reconstitute(props: SubscriptionProps): SubscriptionSchedule {
    return new SubscriptionSchedule(props);
  }

  static create(props: SubscriptionProps): SubscriptionSchedule {
    return new SubscriptionSchedule(props);
  }

  /**
   * @description Called when a cycle payment succeeds.
   * Advances to next cycle. If maxCycles reached, marks COMPLETED.
   */
  onPaymentSuccess(): void {
    const newCycles = this._props.cyclesCompleted + 1;
    const next = this.advanceNextDueAt();

    if (this._props.maxCycles !== null && newCycles >= this._props.maxCycles) {
      this._props = {
        ...this._props,
        cyclesCompleted: newCycles,
        status: 'COMPLETED',
        retryCount: 0,
        nextDueAt: next,
      };
      this._domainEvents.push(new SubscriptionCompletedEvent(this._props.id));
    } else {
      this._props = {
        ...this._props,
        cyclesCompleted: newCycles,
        retryCount: 0,
        nextDueAt: next,
      };
      this._domainEvents.push(
        new SubscriptionCycleCompletedEvent(this._props.id, newCycles),
      );
    }
  }

  /**
   * @description Called when a cycle payment fails.
   * Schedules retry or cancels after max retries.
   */
  onPaymentFailed(): { nextRetryAt: Date | null } {
    const newRetryCount = this._props.retryCount + 1;
    const nextRetryAt = RetryPolicy.nextRetryAt(newRetryCount);

    if (nextRetryAt === null) {
      this._props = {
        ...this._props,
        retryCount: newRetryCount,
        status: 'CANCELLED',
      };
      this._domainEvents.push(new SubscriptionCancelledEvent(this._props.id));
    } else {
      this._props = { ...this._props, retryCount: newRetryCount };
      this._domainEvents.push(
        new SubscriptionRetryScheduledEvent(
          this._props.id,
          newRetryCount,
          nextRetryAt,
        ),
      );
    }
    return { nextRetryAt };
  }

  private advanceNextDueAt(): Date {
    const next = new Date(this._props.nextDueAt);
    if (this._props.interval === 'WEEKLY') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    return next;
  }
}
