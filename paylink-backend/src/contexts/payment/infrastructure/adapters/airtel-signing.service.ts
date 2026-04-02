import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * @description Generates RSA signing headers required for Airtel disbursement requests.
 * x-signature: RSA-SHA256 signature of the serialised request body, Base64 encoded.
 * x-key: RSA public key encrypted with Airtel's public key, Base64 encoded.
 * Both env vars (AIRTEL_DISBURSE_PIN, AIRTEL_DISBURSE_PUBLIC_KEY) are provided by Airtel onboarding.
 */
@Injectable()
export class AirtelSigningService {
  private readonly logger = new Logger(AirtelSigningService.name);
  private readonly publicKey: string;

  constructor(private readonly config: ConfigService) {
    this.publicKey = config.getOrThrow<string>('AIRTEL_DISBURSE_PUBLIC_KEY');
  }

  /**
   * Generates x-signature and x-key headers for a disbursement request body.
   * @param body The request body object (will be JSON-serialised)
   * @returns Headers object with x-signature and x-key
   */
  generateDisbursementHeaders(body: Record<string, unknown>): {
    'x-signature': string;
    'x-key': string;
  } {
    const bodyString = JSON.stringify(body);

    // x-signature: RSA-SHA256 signature of body, Base64 encoded
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(bodyString);
    const xSignature = sign.sign(this.publicKey, 'base64');

    // x-key: RSA public key string, Base64 encoded (as provided by Airtel)
    const xKey = Buffer.from(this.publicKey).toString('base64');

    this.logger.debug('[AIRTEL] Generated disbursement signing headers');
    return { 'x-signature': xSignature, 'x-key': xKey };
  }
}
