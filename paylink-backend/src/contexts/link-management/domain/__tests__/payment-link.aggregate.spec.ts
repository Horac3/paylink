import { PaymentLink } from '../payment-link.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { Money } from '@shared/domain/money.vo';
import { Slug } from '../slug.vo';
import { RecurrencePolicy } from '../recurrence-policy.vo';
import { DomainError } from '@shared/errors/domain.error';

const makeSlug = () => Slug.of('abcd1234');
const makeMerchantId = () => MerchantId.create();

describe('PaymentLink.create()', () => {
  it('creates INVOICE link with amount', () => {
    const link = PaymentLink.create({
      id: 'id-1',
      merchantId: makeMerchantId(),
      slug: makeSlug(),
      type: 'INVOICE',
      amount: Money.of('5000', 'MWK'),
      currency: 'MWK',
      recurrencePolicy: null,
      expiresAt: null,
      metadata: null,
    });
    expect(link.status).toBe('ACTIVE');
    expect(link.type).toBe('INVOICE');
  });

  it('throws if INVOICE has no amount', () => {
    expect(() =>
      PaymentLink.create({
        id: 'id-2',
        merchantId: makeMerchantId(),
        slug: makeSlug(),
        type: 'INVOICE',
        amount: null,
        currency: 'MWK',
        recurrencePolicy: null,
        expiresAt: null,
        metadata: null,
      }),
    ).toThrow(DomainError);
  });

  it('throws if SUBSCRIPTION has no recurrence policy', () => {
    expect(() =>
      PaymentLink.create({
        id: 'id-3',
        merchantId: makeMerchantId(),
        slug: makeSlug(),
        type: 'SUBSCRIPTION',
        amount: Money.of('100', 'MWK'),
        currency: 'MWK',
        recurrencePolicy: null,
        expiresAt: null,
        metadata: null,
      }),
    ).toThrow(DomainError);
  });

  it('creates DONATION with null amount', () => {
    const link = PaymentLink.create({
      id: 'id-4',
      merchantId: makeMerchantId(),
      slug: makeSlug(),
      type: 'DONATION',
      amount: null,
      currency: 'MWK',
      recurrencePolicy: null,
      expiresAt: null,
      metadata: null,
    });
    expect(link.amount).toBeNull();
  });
});

describe('PaymentLink state machine', () => {
  const makeActive = () =>
    PaymentLink.create({
      id: 'id-5',
      merchantId: makeMerchantId(),
      slug: makeSlug(),
      type: 'INVOICE',
      amount: Money.of('500', 'MWK'),
      currency: 'MWK',
      recurrencePolicy: null,
      expiresAt: null,
      metadata: null,
    });

  it('ACTIVE → markPaid() → PAID', () => {
    const link = makeActive();
    link.markPaid();
    expect(link.status).toBe('PAID');
  });

  it('ACTIVE → cancel() → CANCELLED', () => {
    const link = makeActive();
    link.cancel();
    expect(link.status).toBe('CANCELLED');
  });

  it('ACTIVE → expire() → EXPIRED', () => {
    const link = makeActive();
    link.expire();
    expect(link.status).toBe('EXPIRED');
  });

  it('PAID cannot be cancelled', () => {
    const link = makeActive();
    link.markPaid();
    expect(() => link.cancel()).toThrow(DomainError);
  });

  it('EXPIRED cannot be expired again', () => {
    const link = makeActive();
    link.expire();
    expect(() => link.expire()).toThrow(DomainError);
  });
});

describe('RecurrencePolicy.advanceToNextCycle()', () => {
  it('advances weekly by 7 days', () => {
    const base = new Date('2024-01-01');
    const policy = RecurrencePolicy.create({
      interval: 'WEEKLY',
      nextDueAt: base,
      maxCycles: null,
    });
    const next = policy.advanceToNextCycle();
    expect(next.nextDueAt.getDate()).toBe(8);
  });

  it('advances monthly by 1 month', () => {
    const base = new Date('2024-01-15');
    const policy = RecurrencePolicy.create({
      interval: 'MONTHLY',
      nextDueAt: base,
      maxCycles: 12,
    });
    const next = policy.advanceToNextCycle();
    expect(next.nextDueAt.getMonth()).toBe(1); // February
  });
});
