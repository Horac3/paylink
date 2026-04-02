export class InitiatePaymentCommand {
  constructor(
    readonly slug: string,
    readonly payerSessionToken: string | null,
    readonly msisdn: string | null,
    readonly providerCode: string | null,
    readonly rail: string | null = null, // Optional explicit rail override (TNM | AIRTEL | PAWAPAY)
  ) {}
}
