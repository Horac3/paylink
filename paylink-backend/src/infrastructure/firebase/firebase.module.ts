import * as path from 'path';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseMessagingService } from './firebase-messaging.service';
import { FirebaseOtpService } from './firebase-otp.service';

/**
 * @description Global Firebase module. Initialises firebase-admin once on startup.
 * Provides FirebaseMessagingService and FirebaseOtpService globally.
 */
@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      inject: [ConfigService],
      useFactory: (config: ConfigService): admin.app.App => {
        const logger = new Logger('FirebaseModule');
        const serviceAccountPath = config.get<string>(
          'FIREBASE_SERVICE_ACCOUNT_PATH',
        );

        if (!admin.apps.length) {
          if (serviceAccountPath) {
            const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const serviceAccount = require(
              resolvedPath,
            ) as admin.ServiceAccount;
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
            });
            logger.log('Firebase initialised from service account file');
          } else {
            // Development fallback — Firebase calls will fail gracefully
            logger.warn(
              'FIREBASE_SERVICE_ACCOUNT_PATH not set — Firebase running in mock mode',
            );
            admin.initializeApp({
              projectId:
                config.get<string>('FIREBASE_PROJECT_ID') ?? 'paylink-dev',
            });
          }
        }
        return admin.app();
      },
    },
    FirebaseMessagingService,
    FirebaseOtpService,
  ],
  exports: [FirebaseMessagingService, FirebaseOtpService],
})
export class FirebaseModule {}
