import { Merchant } from '../merchant.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';

/**
 * @description Repository interface for Merchant aggregate.
 * Implemented in infrastructure layer.
 */
export interface IMerchantRepository {
  findById(id: MerchantId): Promise<Merchant | null>;
  findByEmail(email: string): Promise<Merchant | null>;
  save(merchant: Merchant): Promise<void>;
}

export const MERCHANT_REPOSITORY = Symbol('IMerchantRepository');
