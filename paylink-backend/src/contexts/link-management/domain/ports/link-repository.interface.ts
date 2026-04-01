import { PaymentLink } from '../payment-link.aggregate';

export interface ILinkRepository {
  findById(id: string): Promise<PaymentLink | null>;
  findBySlug(slug: string): Promise<PaymentLink | null>;
  findByMerchant(
    merchantId: string,
    page: number,
    limit: number,
  ): Promise<{ items: PaymentLink[]; total: number }>;
  save(link: PaymentLink): Promise<void>;
}

export const LINK_REPOSITORY = Symbol('ILinkRepository');
