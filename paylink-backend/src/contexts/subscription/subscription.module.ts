import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
import { SubscriptionListeners } from './application/listeners/subscription.listeners';
import { SubscriptionProcessor } from './application/processors/subscription.processor';

@Module({
  imports: [CqrsModule, BullModule.registerQueue({ name: 'subscription' })],
  providers: [SubscriptionListeners, SubscriptionProcessor],
})
export class SubscriptionModule {}
