import { DomainError } from '@shared/errors/domain.error';

export type RecurrenceInterval = 'WEEKLY' | 'MONTHLY';

export interface RecurrencePolicyProps {
  interval: RecurrenceInterval;
  nextDueAt: Date;
  maxCycles: number | null;
}

/**
 * @description Value object for subscription recurrence rules.
 * Immutable — advanceToNextCycle() returns a new instance.
 */
export class RecurrencePolicy {
  private constructor(private readonly _props: RecurrencePolicyProps) {}

  static create(props: RecurrencePolicyProps): RecurrencePolicy {
    if (!['WEEKLY', 'MONTHLY'].includes(props.interval)) {
      throw new DomainError(`Invalid recurrence interval: ${props.interval}`);
    }
    return new RecurrencePolicy(props);
  }

  get interval(): RecurrenceInterval {
    return this._props.interval;
  }
  get nextDueAt(): Date {
    return this._props.nextDueAt;
  }
  get maxCycles(): number | null {
    return this._props.maxCycles;
  }

  /**
   * @description Returns a new RecurrencePolicy advanced to the next cycle date.
   */
  advanceToNextCycle(): RecurrencePolicy {
    const next = new Date(this._props.nextDueAt);
    if (this._props.interval === 'WEEKLY') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    return new RecurrencePolicy({ ...this._props, nextDueAt: next });
  }

  toJSON(): RecurrencePolicyProps {
    return { ...this._props };
  }
}
