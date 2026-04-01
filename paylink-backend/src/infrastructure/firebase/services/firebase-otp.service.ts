import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

/**
 * @description Firebase Authentication OTP verification service
 * Verifies ID tokens from Firebase phone auth on client side
 */
@Injectable()
export class FirebaseOtpService {
  private readonly logger = new Logger(FirebaseOtpService.name);
  private auth = admin.auth();

  /**
   * @description Verify a Firebase ID token and extract phone number
   * @param idToken Firebase ID token from client
   * @returns Phone number in E.164 format
   * @throws UnauthorisedError if token is invalid or expired
   */
  async verifyIdToken(idToken: string): Promise<string> {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      const phoneNumber = decodedToken.phone_number;
      if (!phoneNumber) {
        throw new UnauthorisedError('Phone number not found in token');
      }
      return phoneNumber;
    } catch (error) {
      this.logger.warn(`OTP verification failed: ${(error as Error).message}`);
      throw new UnauthorisedError('Invalid or expired OTP token');
    }
  }
}
