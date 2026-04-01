import { Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';

/**
 * @description Generates QR code PNG as base64 string for payment URLs.
 */
@Injectable()
export class QrCodeService {
  private readonly logger = new Logger(QrCodeService.name);

  async generate(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
      });
    } catch (err) {
      this.logger.error(`QR code generation failed: ${(err as Error).message}`);
      return '';
    }
  }
}
