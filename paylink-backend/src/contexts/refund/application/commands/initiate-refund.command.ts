export class InitiateRefundCommand {
  constructor(
    readonly transactionId: string,
    readonly merchantId: string,
    readonly amount: string,
    readonly reason: string,
  ) {}
}
