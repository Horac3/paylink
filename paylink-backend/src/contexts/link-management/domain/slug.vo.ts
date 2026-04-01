import { DomainError } from '@shared/errors/domain.error';

/**
 * @description URL-safe 8-character slug uniquely identifying a PaymentLink.
 * Immutable after creation.
 */
export class Slug {
  private readonly _value: string;

  private constructor(value: string) {
    if (!/^[a-zA-Z0-9_-]{8}$/.test(value)) {
      throw new DomainError(`Invalid slug format: ${value}`);
    }
    this._value = value;
  }

  static of(value: string): Slug {
    return new Slug(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
