export class SettlePaymentCommand {
  constructor(
    readonly transactionId: string,
    readonly externalRef: string,
    readonly receiptNumber?: string,       // TNM: receipt_number for future refunds
    readonly externalProviderRef?: string, // Airtel: airtel_money_id for future refunds
  ) {}
}
