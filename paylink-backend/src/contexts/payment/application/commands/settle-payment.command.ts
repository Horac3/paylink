export class SettlePaymentCommand {
  constructor(
    readonly transactionId: string,
    readonly externalRef: string,
  ) {}
}
