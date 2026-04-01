import Decimal from 'decimal.js';
import { DomainError } from '../errors/domain.error';

const SUPPORTED_CURRENCIES = ['MWK', 'USD', 'GBP', 'ZAR'] as const;
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * @description Money value object using Decimal.js for precision arithmetic.
 * All monetary operations use this VO — never use JavaScript float for money.
 * @example
 * const price = Money.of('500.00', 'MWK');
 * const fee = price.multiplyByRate(new Decimal('0.02'));
 * const net = price.subtract(fee);
 */
export class Money {
  private readonly _amount: Decimal;
  private readonly _currency: string;

  private constructor(amount: Decimal, currency: string) {
    if (amount.isNegative()) {
      throw new DomainError(
        `Money amount cannot be negative: ${amount.toString()}`,
      );
    }
    if (!SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)) {
      throw new DomainError(`Unsupported currency: ${currency}`);
    }
    this._amount = amount;
    this._currency = currency;
  }

  /**
   * @description Factory method — amount as decimal string to avoid float precision loss
   * @param amount Decimal string e.g. '500.00'
   * @param currency ISO 4217 currency code
   * @throws DomainError if amount is negative or currency unsupported
   */
  static of(amount: string, currency: string): Money {
    return new Money(new Decimal(amount), currency);
  }

  static fromDecimal(amount: Decimal, currency: string): Money {
    return new Money(amount, currency);
  }

  /**
   * @description Add two Money values
   * @throws DomainError if currencies differ
   */
  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount.plus(other._amount), this._currency);
  }

  /**
   * @description Subtract another Money value
   * @throws DomainError if currencies differ or result is negative
   */
  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this._amount.minus(other._amount);
    if (result.isNegative()) {
      throw new DomainError(
        `Subtraction would result in negative money: ${result.toString()}`,
      );
    }
    return new Money(result, this._currency);
  }

  /**
   * @description Multiply by a rate (e.g. fee rate). Result rounded to 2 decimal places.
   * @param rate Decimal rate e.g. new Decimal('0.02') for 2%
   */
  multiplyByRate(rate: Decimal): Money {
    const result = this._amount
      .mul(rate)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    return new Money(result, this._currency);
  }

  equals(other: Money): boolean {
    return (
      this._amount.equals(other._amount) && this._currency === other._currency
    );
  }

  get amount(): Decimal {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  /**
   * @description Serialize as decimal string for API responses and DB storage
   */
  toString(): string {
    return this._amount.toFixed(2);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount.greaterThan(other._amount);
  }

  isLessThanOrEqualTo(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount.lessThanOrEqualTo(other._amount);
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new DomainError(
        `Currency mismatch: ${this._currency} vs ${other._currency}`,
      );
    }
  }
}
