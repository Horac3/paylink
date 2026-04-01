import { Refund } from '../refund.aggregate';

export interface IRefundRepository {
  findById(id: string): Promise<Refund | null>;
  findByExternalRef(externalRef: string): Promise<Refund | null>;
  findByTransactionId(transactionId: string): Promise<Refund[]>;
  findByMerchant(
    merchantId: string,
    page: number,
    limit: number,
  ): Promise<{ items: Refund[]; total: number }>;
  save(refund: Refund): Promise<void>;
}

export const REFUND_REPOSITORY = Symbol('IRefundRepository');
