export class CreateRecipientTokenCommand {
  constructor(
    readonly linkId: string,
    readonly linkSlug: string,
    readonly msisdn: string,
    readonly providerCode: string | null,
  ) {}
}
