import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  EncryptedMsisdn,
  EncryptedMsisdnData,
} from '../domain/encrypted-msisdn.vo';

/**
 * @description AES-256-GCM MSISDN encryption service.
 * encrypt() is called during registration.
 * decrypt() is ONLY called by ResolvePayerHandler before initiating STK push.
 */
@Injectable()
export class MsisdnEncryptionService {
  private readonly logger = new Logger(MsisdnEncryptionService.name);
  private readonly key: Buffer;
  private readonly ivLength: number;

  constructor(config: ConfigService) {
    const keyHex = config.getOrThrow<string>('ENCRYPTION_KEY');
    this.key = Buffer.from(keyHex, 'hex');
    this.ivLength = config.get<number>('ENCRYPTION_IV_LENGTH') ?? 16;
  }

  /**
   * @description Encrypt a plaintext MSISDN using AES-256-GCM.
   * @param msisdn E.164 phone number e.g. '+265999000001'
   * @returns EncryptedMsisdn VO
   */
  encrypt(msisdn: string): EncryptedMsisdn {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(msisdn, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return EncryptedMsisdn.fromData({
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    } as EncryptedMsisdnData);
  }

  /**
   * @description Decrypt an EncryptedMsisdn. ONLY called by ResolvePayerHandler.
   * @param encrypted EncryptedMsisdn VO
   * @returns Plaintext MSISDN
   */
  decrypt(encrypted: EncryptedMsisdn): string {
    const { ciphertext, iv, authTag } = encrypted.data;
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
