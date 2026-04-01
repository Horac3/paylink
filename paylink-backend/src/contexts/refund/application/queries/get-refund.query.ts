export class GetRefundQuery {
  constructor(
    readonly refundId: string,
    readonly merchantId: string,
  ) {}
}

export class ListRefundsQuery {
  constructor(
    readonly merchantId: string,
    readonly page: number = 1,
    readonly limit: number = 20,
  ) {}
}
