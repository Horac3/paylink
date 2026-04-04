export class InitiatePaymentCommand {
  constructor(
    readonly slug: string,
    readonly payerSessionToken: string | null,
    readonly msisdn: string | null,
    readonly providerCode: string | null,
    readonly rail: string | null = null,
    /** Strategy B — pre-filled recipient JWT */
    readonly recipientToken: string | null = null,
  ) {}
}
