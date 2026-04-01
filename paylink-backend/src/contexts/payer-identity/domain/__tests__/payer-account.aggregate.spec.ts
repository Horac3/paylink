import {
  PayerAccount,
  PayerRegisteredEvent,
  MsisdnVerifiedEvent,
} from '../payer-account.aggregate';
import { PayerId } from '@shared/domain/payer-id.vo';
import { EncryptedMsisdn } from '../encrypted-msisdn.vo';

const makeEncrypted = () =>
  EncryptedMsisdn.fromData({ ciphertext: 'abc', iv: 'def', authTag: 'ghi' });

describe('PayerAccount aggregate', () => {
  it('registers with correct defaults', () => {
    const payer = PayerAccount.register({
      id: PayerId.create(),
      email: 'payer@test.com',
      msisdnEncrypted: makeEncrypted(),
      msisdnHash: 'hash',
      msisdnHint: '0001',
    });

    expect(payer.verified).toBe(false);
    expect(payer.preferredRail).toBe('PAWAPAY');
    expect(payer.fcmToken).toBeNull();
  });

  it('emits PayerRegisteredEvent on register', () => {
    const payer = PayerAccount.register({
      id: PayerId.create(),
      email: 'payer@test.com',
      msisdnEncrypted: makeEncrypted(),
      msisdnHash: 'hash',
      msisdnHint: '0001',
    });
    expect(payer.domainEvents[0]).toBeInstanceOf(PayerRegisteredEvent);
  });

  it('markVerified sets verified=true and emits event', () => {
    const payer = PayerAccount.register({
      id: PayerId.create(),
      email: 'payer@test.com',
      msisdnEncrypted: makeEncrypted(),
      msisdnHash: 'hash',
      msisdnHint: '0001',
    });
    payer.clearEvents();
    payer.markVerified();
    expect(payer.verified).toBe(true);
    expect(payer.domainEvents[0]).toBeInstanceOf(MsisdnVerifiedEvent);
  });

  it('updates FCM token', () => {
    const payer = PayerAccount.register({
      id: PayerId.create(),
      email: 'payer@test.com',
      msisdnEncrypted: makeEncrypted(),
      msisdnHash: 'hash',
      msisdnHint: '0001',
    });
    payer.updateFcmToken('fcm-token-123');
    expect(payer.fcmToken).toBe('fcm-token-123');
  });
});
