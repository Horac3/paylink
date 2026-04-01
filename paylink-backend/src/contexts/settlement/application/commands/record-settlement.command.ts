export class RecordSettlementCommand {
  constructor(
    readonly transactionId: string,
    readonly merchantId: string,
    readonly amount: string,
    readonly currency: string,
    readonly rail: string,
  ) {}
}
