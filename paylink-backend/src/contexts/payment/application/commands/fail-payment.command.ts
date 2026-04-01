export class FailPaymentCommand {
  constructor(
    readonly transactionId: string,
    readonly failureCode?: string,
  ) {}
}
