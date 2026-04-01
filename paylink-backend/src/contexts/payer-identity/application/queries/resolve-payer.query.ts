/**
 * @description Resolves the plaintext MSISDN for STK push initiation.
 * The ONLY sanctioned path for MSISDN decryption.
 */
export class ResolvePayerQuery {
  constructor(readonly payerId: string) {}
}

export interface ResolvedPayer {
  payerId: string;
  msisdn: string;
  preferredRail: string;
  preferredProvider: string;
}
