import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationListeners } from './application/listeners/notification.listeners';
import { EmailProcessor } from './application/processors/email.processor';
import { PushProcessor } from './application/processors/push.processor';
import { WebhookDispatchProcessor } from './application/processors/webhook-dispatch.processor';
import { PdfReceiptService } from './services/pdf-receipt.service';
import { EmailModule } from '../../infrastructure/email/email.module';

@Module({
  imports: [
    EmailModule,
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'push' },
      { name: 'webhook-dispatch' },
    ),
  ],
  providers: [
    NotificationListeners,
    EmailProcessor,
    PushProcessor,
    WebhookDispatchProcessor,
    PdfReceiptService,
  ],
  exports: [PdfReceiptService],
})
export class NotificationModule {}
