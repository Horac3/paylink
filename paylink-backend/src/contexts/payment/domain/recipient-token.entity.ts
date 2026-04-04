/**
 * Represents a one-time signed token that encodes an encrypted MSISDN into a
 * payment link URL. When the payer opens the link the token is resolved
 * server-side and the STK push fires without the payer entering their number.
 * The MSISDN never appears in the URL — only an opaque JWT containing the
 * token ID.
 */
export class RecipientToken {
  constructor(
    public readonly id: string,
    public readonly linkId: string,
    public readonly encryptedMsisdn: string,
    public readonly providerCode: string,
    public readonly expiresAt: Date,
    public used: boolean,
    public usedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isConsumed(): boolean {
    return this.used;
  }

  canBeUsed(): boolean {
    return !this.isExpired() && !this.isConsumed();
  }
}
