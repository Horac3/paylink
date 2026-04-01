/**
 * @description Used by Payment context via QueryBus to validate a link before initiating payment.
 */
export class ValidateLinkQuery {
  constructor(readonly slug: string) {}
}

export interface ValidatedLink {
  linkId: string;
  merchantId: string;
  amount: string | null;
  currency: string;
  type: string;
}
