export class RecordRefundReversalCommand {
  constructor(
    readonly refundId: string,
    readonly transactionId: string,
    readonly merchantId: string,
    readonly amount: string,
    readonly currency: string,
  ) {}
}
