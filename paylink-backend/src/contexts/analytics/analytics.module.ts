import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnalyticsController } from './interface/analytics.controller';
import {
  GetLinkAnalyticsHandler,
  GetMerchantAnalyticsHandler,
} from './application/queries/get-analytics.handler';
import { AnalyticsListeners } from './application/listeners/analytics.listeners';

@Module({
  imports: [CqrsModule],
  controllers: [AnalyticsController],
  providers: [
    GetLinkAnalyticsHandler,
    GetMerchantAnalyticsHandler,
    AnalyticsListeners,
  ],
})
export class AnalyticsModule {}
