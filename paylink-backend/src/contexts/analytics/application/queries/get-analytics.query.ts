export class GetLinkAnalyticsQuery {
  constructor(
    readonly linkId: string,
    readonly merchantId: string,
  ) {}
}

export class GetMerchantAnalyticsQuery {
  constructor(readonly merchantId: string) {}
}
