import { MerchantId } from '@shared/domain/merchant-id.vo';
import { FeeTier } from '@shared/domain/fee-tier.vo';
import { DomainEvent } from '@shared/domain/domain-event.base';
import { DomainError } from '@shared/errors/domain.error';

export class MerchantRegisteredEvent extends DomainEvent {
  readonly eventType = 'merchant.registered';
  constructor(
    readonly merchantId: string,
    readonly email: string,
    readonly businessName: string,
  ) {
    super();
  }
}

export interface MerchantProps {
  id: MerchantId;
  email: string;
  businessName: string;
  passwordHash: string;
  feeTier: FeeTier;
}

/**
 * @description Merchant aggregate root. Represents a business using PayLink.
 */
export class Merchant {
  private readonly _domainEvents: DomainEvent[] = [];

  private constructor(private readonly _props: MerchantProps) {}

  get id(): MerchantId {
    return this._props.id;
  }
  get email(): string {
    return this._props.email;
  }
  get businessName(): string {
    return this._props.businessName;
  }
  get passwordHash(): string {
    return this._props.passwordHash;
  }
  get feeTier(): FeeTier {
    return this._props.feeTier;
  }
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  /**
   * @description Factory: register a new merchant. Password must already be hashed.
   * @param id Pre-generated MerchantId
   * @param email Unique merchant email
   * @param businessName Trading name
   * @param passwordHash bcrypt hash of the password
   * @throws DomainError if email is empty
   */
  static register(props: {
    id: MerchantId;
    email: string;
    businessName: string;
    passwordHash: string;
  }): Merchant {
    if (!props.email || !props.email.includes('@')) {
      throw new DomainError('Invalid email address');
    }
    if (!props.businessName.trim()) {
      throw new DomainError('Business name is required');
    }
    const merchant = new Merchant({
      ...props,
      feeTier: FeeTier.STARTER,
    });
    merchant._domainEvents.push(
      new MerchantRegisteredEvent(
        props.id.value,
        props.email,
        props.businessName,
      ),
    );
    return merchant;
  }

  /**
   * @description Reconstitute merchant from persistence (no events emitted).
   */
  static reconstitute(props: MerchantProps): Merchant {
    return new Merchant(props);
  }
}
