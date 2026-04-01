import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FirebaseMessagingService } from '../../../../infrastructure/firebase/firebase-messaging.service';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@Processor('push')
export class PushProcessor extends WorkerHost {
  private readonly logger = new Logger(PushProcessor.name);

  constructor(
    private readonly fcm: FirebaseMessagingService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { type } = job.data as {
      type: string;
      transactionId?: string;
      refundId?: string;
    };

    // Resolve FCM token from payer account
    let fcmToken: string | null = null;
    if (job.data.transactionId) {
      const txn = await this.prisma.transaction.findUnique({
        where: { id: job.data.transactionId },
        include: { payerAccount: true },
      });
      fcmToken = txn?.payerAccount?.fcmToken ?? null;
    }

    if (!fcmToken) {
      this.logger.debug(`No FCM token for job ${job.name} — skipping push`);
      return;
    }

    const payloads: Record<string, { title: string; body: string }> = {
      payment_settled: {
        title: 'Payment Confirmed',
        body: 'Your payment has been confirmed',
      },
      payment_failed: {
        title: 'Payment Failed',
        body: 'Your payment could not be processed. Please try again.',
      },
      refund_initiated: {
        title: 'Refund Initiated',
        body: 'Your refund has been initiated',
      },
      refund_completed: {
        title: 'Refund Completed',
        body: 'Your refund has been sent to your mobile money account',
      },
    };

    const payload = payloads[type];
    if (payload) {
      await this.fcm.sendToDevice(fcmToken, payload);
    }
  }
}
