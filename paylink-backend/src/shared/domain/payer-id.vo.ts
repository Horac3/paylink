import { UniqueId } from './unique-id.vo';

/**
 * @description Branded UUID for Payer identity
 */
export class PayerId extends UniqueId {
  private readonly _brand = 'PayerId';

  static create(value?: string): PayerId {
    return new PayerId(value);
  }
}
