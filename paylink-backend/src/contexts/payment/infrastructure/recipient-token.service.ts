import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

interface RecipientTokenPayload {
  rid: string; // token ID — never contains MSISDN
  iat?: number;
  exp?: number;
}

/**
 * Signs and verifies RecipientToken JWTs.
 * The JWT payload contains only the token ID — never the MSISDN.
 * The MSISDN is resolved from the database after JWT verification.
 *
 * Also handles AES-256-GCM encryption/decryption of MSISDNs stored in
 * RecipientToken rows, reusing the same ENCRYPTION_KEY as payer MSISDN storage.
 */
@Injectable()
export class RecipientTokenService {
  private readonly secret: string;
  private readonly key: Buffer;
  private readonly ivLength: number;

  constructor(config: ConfigService) {
    this.secret = config.getOrThrow<string>('RECIPIENT_TOKEN_SECRET');
    const keyHex = config.getOrThrow<string>('ENCRYPTION_KEY');
    this.key = Buffer.from(keyHex, 'hex');
    this.ivLength = config.get<number>('ENCRYPTION_IV_LENGTH') ?? 16;
  }

  /**
   * Signs a JWT that carries only the token ID.
   * Expiry is derived from the token's expiresAt datetime.
   */
  sign(tokenId: string, expiresAt: Date): string {
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = Math.floor(expiresAt.getTime() / 1000);
    const payload: RecipientTokenPayload = { rid: tokenId };
    return jwt.sign(payload, this.secret, {
      expiresIn: expSec - nowSec,
    } as jwt.SignOptions);
  }

  /**
   * Verifies the JWT and returns the token ID.
   * Throws UnauthorisedError if invalid or expired.
   */
  verify(token: string): string {
    try {
      const decoded = jwt.verify(token, this.secret) as RecipientTokenPayload;
      return decoded.rid;
    } catch {
      throw new UnauthorisedError('Recipient token is invalid or expired');
    }
  }

  /** Encrypts an MSISDN for storage in the RecipientToken row. */
  encrypt(msisdn: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(msisdn, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.from(
      JSON.stringify({
        ciphertext: ciphertext.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
      }),
    ).toString('base64');
  }

  /** Decrypts a stored MSISDN. Called only during STK push resolution. */
  decrypt(encoded: string): string {
    const { ciphertext, iv, authTag } = JSON.parse(
      Buffer.from(encoded, 'base64').toString('utf-8'),
    ) as { ciphertext: string; iv: string; authTag: string };
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertext, 'base64')),
      decipher.final(),
    ]).toString('utf-8');
  }
}
