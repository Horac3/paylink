import { DomainEvent } from '@shared/domain/domain-event.base';
import { Money } from '@shared/domain/money.vo';
import { DomainError } from '@shared/errors/domain.error';

export type TxnStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export class PaymentInitiatedEvent extends DomainEvent {
  readonly eventType = 'payment.initiated';
  constructor(
    readonly transactionId: string,
    readonly merchantId: string,
    readonly linkId: string,
    readonly amount: string,
    readonly currency: string,
    readonly rail: string,
  ) {
    super();
  }
}

export class PaymentSettledEvent extends DomainEvent {
  readonly eventType = 'payment.settled';
  constructor(
    readonly transactionId: string,
    readonly merchantId: string,
    readonly amount: string,
    readonly currency: string,
    readonly rail: string,
    readonly externalRef: string,
  ) {
    super();
  }
}

export class PaymentFailedEvent extends DomainEvent {
  readonly eventType = 'payment.failed';
  constructor(
    readonly transactionId: string,
    readonly merchantId: string,
    readonly failureCode?: string,
  ) {
    super();
  }
}

export interface TransactionProps {
  id: string;
  linkId: string;
  merchantId: string;
  payerAccountId: string | null;
  grossAmount: Money;
  feeRate: string;
  feeAmount: Money;
  netAmount: Money;
  rail: string;
  providerCode: string;
  externalRef: string | null;
  status: TxnStatus;
  webhookDelivered: boolean;
}

/**
 * @description Transaction aggregate. Represents a single payment attempt.
 */
export class Transaction {
  private readonly _domainEvents: DomainEvent[] = [];

  private constructor(private _props: TransactionProps) {}

  get id(): string {
    return this._props.id;
  }
  get linkId(): string {
    return this._props.linkId;
  }
  get merchantId(): string {
    return this._props.merchantId;
  }
  get payerAccountId(): string | null {
    return this._props.payerAccountId;
  }
  get grossAmount(): Money {
    return this._props.grossAmount;
  }
  get feeRate(): string {
    return this._props.feeRate;
  }
  get feeAmount(): Money {
    return this._props.feeAmount;
  }
  get netAmount(): Money {
    return this._props.netAmount;
  }
  get rail(): string {
    return this._props.rail;
  }
  get providerCode(): string {
    return this._props.providerCode;
  }
  get externalRef(): string | null {
    return this._props.externalRef;
  }
  get status(): TxnStatus {
    return this._props.status;
  }
  get webhookDelivered(): boolean {
    return this._props.webhookDelivered;
  }
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents.length = 0;
  }

  static create(
    props: Omit<TransactionProps, 'status' | 'webhookDelivered'>,
  ): Transaction {
    const txn = new Transaction({
      ...props,
      status: 'PENDING',
      webhookDelivered: false,
    });
    txn._domainEvents.push(
      new PaymentInitiatedEvent(
        props.id,
        props.merchantId,
        props.linkId,
        props.grossAmount.toString(),
        props.grossAmount.currency,
        props.rail,
      ),
    );
    return txn;
  }

  static reconstitute(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  setExternalRef(ref: string): void {
    this._props = { ...this._props, externalRef: ref };
  }

  /**
   * @description Mark transaction as successful (idempotent — already SUCCESS returns early).
   * @throws DomainError if status is FAILED or REFUNDED
   */
  markSuccess(): void {
    if (this._props.status === 'SUCCESS') return;
    if (!['PENDING'].includes(this._props.status)) {
      throw new DomainError(
        `Cannot settle transaction in status: ${this._props.status}`,
      );
    }
    this._props = { ...this._props, status: 'SUCCESS' };
    this._domainEvents.push(
      new PaymentSettledEvent(
        this._props.id,
        this._props.merchantId,
        this._props.grossAmount.toString(),
        this._props.grossAmount.currency,
        this._props.rail,
        this._props.externalRef ?? '',
      ),
    );
  }

  markFailed(failureCode?: string): void {
    if (this._props.status === 'FAILED') return;
    this._props = { ...this._props, status: 'FAILED' };
    this._domainEvents.push(
      new PaymentFailedEvent(
        this._props.id,
        this._props.merchantId,
        failureCode,
      ),
    );
  }

  markRefunded(): void {
    if (this._props.status !== 'SUCCESS') {
      throw new DomainError('Can only refund a successful transaction');
    }
    this._props = { ...this._props, status: 'REFUNDED' };
  }
}
