export class InitiatePaymentCommand {
  constructor(
    readonly slug: string,
    readonly payerSessionToken: string | null,
    readonly msisdn: string | null,
    readonly providerCode: string | null,
  ) {}
}
