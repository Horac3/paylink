import { PayerId } from '@shared/domain/payer-id.vo';
import { DomainEvent } from '@shared/domain/domain-event.base';
import { EncryptedMsisdn } from './encrypted-msisdn.vo';

export class PayerRegisteredEvent extends DomainEvent {
  readonly eventType = 'payer.registered';
  constructor(
    readonly payerId: string,
    readonly email: string,
  ) {
    super();
  }
}

export class MsisdnVerifiedEvent extends DomainEvent {
  readonly eventType = 'payer.msisdn_verified';
  constructor(readonly payerId: string) {
    super();
  }
}

export interface PayerAccountProps {
  id: PayerId;
  email: string;
  msisdnEncrypted: EncryptedMsisdn;
  msisdnHash: string;
  msisdnHint: string;
  preferredRail: string;
  preferredProvider: string;
  verified: boolean;
  fcmToken: string | null;
}

/**
 * @description PayerAccount aggregate. Represents a mobile money payer in PayLink.
 * MSISDN is always stored encrypted. Never logged in full.
 */
export class PayerAccount {
  private readonly _domainEvents: DomainEvent[] = [];

  private constructor(private _props: PayerAccountProps) {}

  get id(): PayerId {
    return this._props.id;
  }
  get email(): string {
    return this._props.email;
  }
  get msisdnEncrypted(): EncryptedMsisdn {
    return this._props.msisdnEncrypted;
  }
  get msisdnHash(): string {
    return this._props.msisdnHash;
  }
  get msisdnHint(): string {
    return this._props.msisdnHint;
  }
  get preferredRail(): string {
    return this._props.preferredRail;
  }
  get preferredProvider(): string {
    return this._props.preferredProvider;
  }
  get verified(): boolean {
    return this._props.verified;
  }
  get fcmToken(): string | null {
    return this._props.fcmToken;
  }
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  /**
   * @description Factory — create a new unverified payer account.
   */
  static register(props: {
    id: PayerId;
    email: string;
    msisdnEncrypted: EncryptedMsisdn;
    msisdnHash: string;
    msisdnHint: string;
  }): PayerAccount {
    const account = new PayerAccount({
      ...props,
      preferredRail: 'PAWAPAY',
      preferredProvider: 'AIRTEL_MWI',
      verified: false,
      fcmToken: null,
    });
    account._domainEvents.push(
      new PayerRegisteredEvent(props.id.value, props.email),
    );
    return account;
  }

  static reconstitute(props: PayerAccountProps): PayerAccount {
    return new PayerAccount(props);
  }

  /**
   * @description Mark payer MSISDN as verified after Firebase OTP check.
   */
  markVerified(): void {
    this._props = { ...this._props, verified: true };
    this._domainEvents.push(new MsisdnVerifiedEvent(this._props.id.value));
  }

  updateFcmToken(token: string): void {
    this._props = { ...this._props, fcmToken: token };
  }

  updatePreferences(rail: string, providerCode: string): void {
    this._props = {
      ...this._props,
      preferredRail: rail,
      preferredProvider: providerCode,
    };
  }
}
