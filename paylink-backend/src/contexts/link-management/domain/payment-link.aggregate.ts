import { MerchantId } from '@shared/domain/merchant-id.vo';
import { Money } from '@shared/domain/money.vo';
import { DomainEvent } from '@shared/domain/domain-event.base';
import { DomainError } from '@shared/errors/domain.error';
import { Slug } from './slug.vo';
import { RecurrencePolicy } from './recurrence-policy.vo';

export type LinkType = 'INVOICE' | 'SUBSCRIPTION' | 'DONATION' | 'REQUEST';
export type LinkStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'CANCELLED';

export class LinkCreatedEvent extends DomainEvent {
  readonly eventType = 'link.created';
  constructor(
    readonly linkId: string,
    readonly merchantId: string,
    readonly slug: string,
  ) {
    super();
  }
}
export class LinkPaidEvent extends DomainEvent {
  readonly eventType = 'link.paid';
  constructor(readonly linkId: string) {
    super();
  }
}
export class LinkExpiredEvent extends DomainEvent {
  readonly eventType = 'link.expired';
  constructor(readonly linkId: string) {
    super();
  }
}
export class LinkCancelledEvent extends DomainEvent {
  readonly eventType = 'link.cancelled';
  constructor(readonly linkId: string) {
    super();
  }
}

export interface PaymentLinkProps {
  id: string;
  merchantId: MerchantId;
  slug: Slug;
  type: LinkType;
  amount: Money | null;
  currency: string;
  status: LinkStatus;
  recurrencePolicy: RecurrencePolicy | null;
  expiresAt: Date | null;
  metadata: Record<string, unknown> | null;
  qrCodeBase64: string | null;
}

/**
 * @description PaymentLink aggregate. Full state machine enforced in domain.
 */
export class PaymentLink {
  private readonly _domainEvents: DomainEvent[] = [];

  private constructor(private _props: PaymentLinkProps) {}

  get id(): string {
    return this._props.id;
  }
  get merchantId(): MerchantId {
    return this._props.merchantId;
  }
  get slug(): Slug {
    return this._props.slug;
  }
  get type(): LinkType {
    return this._props.type;
  }
  get amount(): Money | null {
    return this._props.amount;
  }
  get currency(): string {
    return this._props.currency;
  }
  get status(): LinkStatus {
    return this._props.status;
  }
  get recurrencePolicy(): RecurrencePolicy | null {
    return this._props.recurrencePolicy;
  }
  get expiresAt(): Date | null {
    return this._props.expiresAt;
  }
  get metadata(): Record<string, unknown> | null {
    return this._props.metadata;
  }
  get qrCodeBase64(): string | null {
    return this._props.qrCodeBase64;
  }
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  /**
   * @description Factory with type-specific validation.
   * INVOICE requires amount. SUBSCRIPTION requires amount + recurrencePolicy.
   * DONATION allows null amount.
   */
  static create(props: {
    id: string;
    merchantId: MerchantId;
    slug: Slug;
    type: LinkType;
    amount: Money | null;
    currency: string;
    recurrencePolicy: RecurrencePolicy | null;
    expiresAt: Date | null;
    metadata: Record<string, unknown> | null;
  }): PaymentLink {
    if (props.type === 'INVOICE' && !props.amount) {
      throw new DomainError('INVOICE links require an amount');
    }
    if (props.type === 'SUBSCRIPTION') {
      if (!props.amount)
        throw new DomainError('SUBSCRIPTION links require an amount');
      if (!props.recurrencePolicy)
        throw new DomainError('SUBSCRIPTION links require a recurrence policy');
    }

    const link = new PaymentLink({
      ...props,
      status: 'ACTIVE',
      qrCodeBase64: null,
    });
    link._domainEvents.push(
      new LinkCreatedEvent(props.id, props.merchantId.value, props.slug.value),
    );
    return link;
  }

  static reconstitute(props: PaymentLinkProps): PaymentLink {
    return new PaymentLink(props);
  }

  setQrCode(base64: string): void {
    this._props = { ...this._props, qrCodeBase64: base64 };
  }

  /**
   * @description Mark link as fully paid.
   * @throws DomainError if not in ACTIVE or PARTIALLY_PAID status
   */
  markPaid(): void {
    if (!['ACTIVE', 'PARTIALLY_PAID'].includes(this._props.status)) {
      throw new DomainError(
        `Cannot mark PAID from status: ${this._props.status}`,
      );
    }
    this._props = { ...this._props, status: 'PAID' };
    this._domainEvents.push(new LinkPaidEvent(this._props.id));
  }

  markPartiallyPaid(): void {
    if (this._props.status !== 'ACTIVE') {
      throw new DomainError(
        `Cannot mark PARTIALLY_PAID from status: ${this._props.status}`,
      );
    }
    this._props = { ...this._props, status: 'PARTIALLY_PAID' };
  }

  /**
   * @description Cancel the link.
   * @throws DomainError if already PAID or CANCELLED
   */
  cancel(): void {
    if (['PAID', 'CANCELLED'].includes(this._props.status)) {
      throw new DomainError(
        `Cannot cancel link in status: ${this._props.status}`,
      );
    }
    this._props = { ...this._props, status: 'CANCELLED' };
    this._domainEvents.push(new LinkCancelledEvent(this._props.id));
  }

  /**
   * @description Expire the link.
   * @throws DomainError if not ACTIVE
   */
  expire(): void {
    if (this._props.status !== 'ACTIVE') {
      throw new DomainError(
        `Cannot expire link in status: ${this._props.status}`,
      );
    }
    this._props = { ...this._props, status: 'EXPIRED' };
    this._domainEvents.push(new LinkExpiredEvent(this._props.id));
  }

  isExpired(): boolean {
    return !!this._props.expiresAt && this._props.expiresAt < new Date();
  }

  isActive(): boolean {
    return this._props.status === 'ACTIVE' && !this.isExpired();
  }
}
