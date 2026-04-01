import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import * as crypto from 'crypto';
import axios from 'axios';

@Processor('webhook-dispatch')
export class WebhookDispatchProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookDispatchProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(
    job: Job<{ transactionId: string; merchantId: string }>,
  ): Promise<void> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: job.data.merchantId },
    });
    if (!merchant?.webhookUrl || !merchant?.webhookSecret) return;

    const txn = await this.prisma.transaction.findUnique({
      where: { id: job.data.transactionId },
    });
    if (!txn) return;

    const payload = JSON.stringify({
      event: 'payment.settled',
      transactionId: txn.id,
      amount: txn.grossAmount.toString(),
      currency: 'MWK',
      status: txn.status,
    });

    const signature = crypto
      .createHmac('sha256', merchant.webhookSecret)
      .update(payload)
      .digest('hex');

    try {
      await axios.post(merchant.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-PayLink-Signature': signature,
        },
        timeout: 10000,
      });
      await this.prisma.transaction.update({
        where: { id: txn.id },
        data: { webhookDelivered: true },
      });
      this.logger.log(`Webhook delivered: txn=${txn.id}`);
    } catch (err) {
      this.logger.error(`Webhook delivery failed: ${(err as Error).message}`);
    }
  }
}
