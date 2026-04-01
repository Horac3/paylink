export class GetMerchantQuery {
  constructor(readonly merchantId: string) {}
}

export interface MerchantReadModel {
  id: string;
  email: string;
  businessName: string;
  feeTier: string;
  createdAt: Date;
}
