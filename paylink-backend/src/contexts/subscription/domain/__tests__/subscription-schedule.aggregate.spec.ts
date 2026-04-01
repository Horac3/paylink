import {
  SubscriptionSchedule,
  SubscriptionCycleCompletedEvent,
  SubscriptionCompletedEvent,
  SubscriptionRetryScheduledEvent,
  SubscriptionCancelledEvent,
} from '../subscription-schedule.aggregate';

const makeSub = (
  overrides: Partial<Parameters<typeof SubscriptionSchedule.create>[0]> = {},
) =>
  SubscriptionSchedule.create({
    id: 'sub-1',
    linkId: 'link-1',
    payerAccountId: 'payer-1',
    status: 'ACTIVE',
    interval: 'MONTHLY',
    nextDueAt: new Date('2024-01-01'),
    retryCount: 0,
    cyclesCompleted: 0,
    maxCycles: null,
    ...overrides,
  });

describe('SubscriptionSchedule', () => {
  it('onPaymentSuccess advances cycle and emits CycleCompleted', () => {
    const sub = makeSub();
    sub.onPaymentSuccess();
    expect(sub.cyclesCompleted).toBe(1);
    expect(sub.retryCount).toBe(0);
    expect(sub.domainEvents[0]).toBeInstanceOf(SubscriptionCycleCompletedEvent);
  });

  it('onPaymentSuccess emits SubscriptionCompleted when maxCycles reached', () => {
    const sub = makeSub({ maxCycles: 3, cyclesCompleted: 2 });
    sub.onPaymentSuccess();
    expect(sub.status).toBe('COMPLETED');
    expect(sub.domainEvents[0]).toBeInstanceOf(SubscriptionCompletedEvent);
  });

  it('onPaymentFailed increments retryCount and emits RetryScheduled', () => {
    const sub = makeSub();
    const { nextRetryAt } = sub.onPaymentFailed();
    expect(sub.retryCount).toBe(1);
    expect(nextRetryAt).toBeInstanceOf(Date);
    expect(sub.domainEvents[0]).toBeInstanceOf(SubscriptionRetryScheduledEvent);
  });

  it('onPaymentFailed cancels after 4 retries', () => {
    const sub = makeSub({ retryCount: 3 });
    const { nextRetryAt } = sub.onPaymentFailed();
    expect(nextRetryAt).toBeNull();
    expect(sub.status).toBe('CANCELLED');
    expect(sub.domainEvents[0]).toBeInstanceOf(SubscriptionCancelledEvent);
  });

  it('RetryPolicy intervals are correct', () => {
    const { RetryPolicy } = require('../retry-policy.vo');
    expect(RetryPolicy.delayFor(1)).toBe(24 * 60 * 60 * 1000);
    expect(RetryPolicy.delayFor(2)).toBe(72 * 60 * 60 * 1000);
    expect(RetryPolicy.delayFor(3)).toBe(7 * 24 * 60 * 60 * 1000);
    expect(RetryPolicy.delayFor(4)).toBeNull();
  });

  it('advances MONTHLY next due date by 1 month', () => {
    const sub = makeSub({
      interval: 'MONTHLY',
      nextDueAt: new Date('2024-01-15'),
    });
    sub.onPaymentSuccess();
    expect(sub.nextDueAt.getMonth()).toBe(1); // February
  });

  it('advances WEEKLY next due date by 7 days', () => {
    const sub = makeSub({
      interval: 'WEEKLY',
      nextDueAt: new Date('2024-01-01'),
    });
    sub.onPaymentSuccess();
    expect(sub.nextDueAt.getDate()).toBe(8);
  });
});
