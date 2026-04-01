import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

/**
 * @description Service for verifying Firebase phone OTP tokens.
 * The client handles OTP delivery via Firebase Auth SDK (free via Spark plan).
 */
@Injectable()
export class FirebaseOtpService {
  private readonly logger = new Logger(FirebaseOtpService.name);

  /**
   * @description Verify a Firebase Auth ID token and extract the phone number.
   * @param idToken Firebase Auth ID token from the client after OTP verification
   * @returns E.164 phone number extracted from the verified token
   * @throws UnauthorizedException if the token is invalid or expired
   */
  async verifyIdToken(idToken: string): Promise<string> {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      const phone = decoded.phone_number;
      if (!phone) {
        throw new UnauthorizedException(
          'Token does not contain a phone number',
        );
      }
      this.logger.debug(`OTP verified for phone: ****${phone.slice(-4)}`);
      return phone;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.error(`OTP verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Invalid or expired OTP token');
    }
  }
}
