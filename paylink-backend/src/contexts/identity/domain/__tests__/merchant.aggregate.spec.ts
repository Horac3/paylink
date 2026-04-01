import { Merchant } from '../merchant.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { DomainError } from '@shared/errors/domain.error';
import { MerchantRegisteredEvent } from '../merchant.aggregate';

describe('Merchant.register()', () => {
  const validProps = {
    id: MerchantId.create(),
    email: 'merchant@example.com',
    businessName: 'Test Biz',
    passwordHash: '$2b$12$hashedpassword',
  };

  it('creates merchant with correct properties', () => {
    const merchant = Merchant.register(validProps);
    expect(merchant.email).toBe('merchant@example.com');
    expect(merchant.businessName).toBe('Test Biz');
  });

  it('emits MerchantRegisteredEvent', () => {
    const merchant = Merchant.register(validProps);
    const events = merchant.domainEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(MerchantRegisteredEvent);
    expect((events[0] as MerchantRegisteredEvent).email).toBe(
      'merchant@example.com',
    );
  });

  it('throws DomainError for invalid email', () => {
    expect(() =>
      Merchant.register({ ...validProps, email: 'notanemail' }),
    ).toThrow(DomainError);
  });

  it('throws DomainError for empty businessName', () => {
    expect(() =>
      Merchant.register({ ...validProps, businessName: '   ' }),
    ).toThrow(DomainError);
  });

  it('clears events after clearEvents()', () => {
    const merchant = Merchant.register(validProps);
    merchant.clearEvents();
    expect(merchant.domainEvents).toHaveLength(0);
  });
});
