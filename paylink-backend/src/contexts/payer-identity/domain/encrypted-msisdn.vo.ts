/**
 * @description Value object storing AES-256-GCM encrypted MSISDN.
 * Stores ciphertext, iv, and authTag as a base64 JSON string.
 * No decrypt method — decryption only occurs in MsisdnEncryptionService.
 */
export interface EncryptedMsisdnData {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export class EncryptedMsisdn {
  private constructor(private readonly _data: EncryptedMsisdnData) {}

  static fromData(data: EncryptedMsisdnData): EncryptedMsisdn {
    return new EncryptedMsisdn(data);
  }

  static fromString(encoded: string): EncryptedMsisdn {
    const data = JSON.parse(
      Buffer.from(encoded, 'base64').toString('utf-8'),
    ) as EncryptedMsisdnData;
    return new EncryptedMsisdn(data);
  }

  /**
   * @description Serialise for database storage — base64-encoded JSON
   */
  toStorageString(): string {
    return Buffer.from(JSON.stringify(this._data)).toString('base64');
  }

  get data(): EncryptedMsisdnData {
    return { ...this._data };
  }
}
