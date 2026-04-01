import { UniqueId } from './unique-id.vo';

/**
 * @description Branded UUID for Merchant identity
 */
export class MerchantId extends UniqueId {
  private readonly _brand = 'MerchantId';

  static create(value?: string): MerchantId {
    return new MerchantId(value);
  }
}
