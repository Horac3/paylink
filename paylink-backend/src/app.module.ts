import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import * as Joi from 'joi';

import { PrismaModule } from './infrastructure/database/prisma.module';
import { FirebaseModule } from './infrastructure/firebase/firebase.module';
import { AppPassportModule } from './infrastructure/passport/passport.module';
import { IdentityModule } from './contexts/identity/identity.module';
import { PayerIdentityModule } from './contexts/payer-identity/payer-identity.module';
import { LinkManagementModule } from './contexts/link-management/link-management.module';
import { PaymentModule } from './contexts/payment/payment.module';
import { RefundModule } from './contexts/refund/refund.module';
import { SettlementModule } from './contexts/settlement/settlement.module';
import { NotificationModule } from './contexts/notification/notification.module';
import { SubscriptionModule } from './contexts/subscription/subscription.module';
import { AnalyticsModule } from './contexts/analytics/analytics.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Config — global, validates all env vars on startup
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRY: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
        PAYER_SESSION_SECRET: Joi.string().required(),
        PAYER_SESSION_EXPIRY: Joi.string().default('30d'),
        PAWAPAY_API_TOKEN: Joi.string().required(),
        PAWAPAY_BASE_URL: Joi.string().uri().required(),
        // TNM Mpamba
        TNM_BASE_URL: Joi.string().uri().optional(),
        TNM_WALLET: Joi.string().optional(),
        TNM_PASSWORD: Joi.string().optional(),
        // Airtel Money
        AIRTEL_BASE_URL: Joi.string().uri().optional(),
        AIRTEL_CLIENT_ID: Joi.string().optional(),
        AIRTEL_CLIENT_SECRET: Joi.string().optional(),
        AIRTEL_COUNTRY: Joi.string().default('MW'),
        AIRTEL_CURRENCY: Joi.string().default('MWK'),
        AIRTEL_DISBURSE_PIN: Joi.string().optional(),
        AIRTEL_DISBURSE_PUBLIC_KEY: Joi.string().optional(),
        FIREBASE_SERVICE_ACCOUNT_PATH: Joi.string().optional(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
        ENCRYPTION_KEY: Joi.string().length(64).required(),
        ENCRYPTION_IV_LENGTH: Joi.number().default(16),
        APP_URL: Joi.string().uri().required(),
        WEB_URL: Joi.string().uri().required(),
        DOCS_URL: Joi.string().uri().optional(),
        RECIPIENT_TOKEN_SECRET: Joi.string().min(32).required(),
        RECIPIENT_TOKEN_EXPIRY_HOURS: Joi.number().default(72),
        APP_PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
      }),
    }),

    // Event emitter — wildcard enabled, delimiter '.'
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
    }),

    // BullMQ — Redis connection from ConfigService
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    // Infrastructure (global)
    PrismaModule,
    FirebaseModule,
    AppPassportModule,

    // Bounded contexts
    IdentityModule,
    PayerIdentityModule,
    LinkManagementModule,
    PaymentModule,
    RefundModule,
    SettlementModule,
    NotificationModule,
    SubscriptionModule,
    AnalyticsModule,

    // Admin
    AdminModule,
  ],
})
export class AppModule {}
