import {
  Refund,
  RefundInitiatedEvent,
  RefundCompletedEvent,
  RefundFailedEvent,
  RefundCancelledEvent,
} from '../refund.aggregate';
import { Money } from '@shared/domain/money.vo';
import { DomainError } from '@shared/errors/domain.error';

const makeRefund = (overrides?: Partial<Parameters<typeof Refund.create>[0]>) =>
  Refund.create({
    id: 'ref-1',
    transactionId: 'txn-1',
    merchantId: 'merch-1',
    depositId: 'dep-1',
    amount: Money.of('500', 'MWK'),
    currency: 'MWK',
    rail: 'PAWAPAY',
    reason: 'Test refund',
    ...overrides,
  });

describe('Refund aggregate', () => {
  it('creates PENDING refund and emits RefundInitiatedEvent', () => {
    const refund = makeRefund();
    expect(refund.status).toBe('PENDING');
    expect(refund.domainEvents[0]).toBeInstanceOf(RefundInitiatedEvent);
  });

  it('PENDING → complete() → COMPLETED', () => {
    const refund = makeRefund();
    refund.clearEvents();
    refund.complete();
    expect(refund.status).toBe('COMPLETED');
    expect(refund.domainEvents[0]).toBeInstanceOf(RefundCompletedEvent);
    expect(refund.resolvedAt).toBeInstanceOf(Date);
  });

  it('PENDING → fail() → FAILED', () => {
    const refund = makeRefund();
    refund.clearEvents();
    refund.fail('PROVIDER_ERROR');
    expect(refund.status).toBe('FAILED');
    expect(refund.domainEvents[0]).toBeInstanceOf(RefundFailedEvent);
  });

  it('PENDING → cancel() → CANCELLED (no externalRef)', () => {
    const refund = makeRefund();
    refund.clearEvents();
    refund.cancel();
    expect(refund.status).toBe('CANCELLED');
    expect(refund.domainEvents[0]).toBeInstanceOf(RefundCancelledEvent);
  });

  it('cannot cancel after externalRef set', () => {
    const refund = makeRefund();
    refund.setExternalRef('ext-ref');
    expect(() => refund.cancel()).toThrow(DomainError);
  });

  it('COMPLETED cannot be failed', () => {
    const refund = makeRefund();
    refund.complete();
    expect(() => refund.fail('reason')).toThrow(DomainError);
  });

  it('idempotent complete throws if already COMPLETED', () => {
    const refund = makeRefund();
    refund.complete();
    expect(() => refund.complete()).toThrow(DomainError);
  });
});
