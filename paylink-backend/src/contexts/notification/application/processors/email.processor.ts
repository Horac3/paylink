import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../../../../infrastructure/email/email.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing email job: ${job.name}`);

    switch (job.name) {
      case 'send-receipt-email':
        await this.emailService.sendMail({
          to: job.data.email ?? 'noreply@paylink.mw',
          subject: 'Payment Confirmed — PayLink',
          template: 'receipt',
          context: job.data,
        });
        break;
      case 'send-refund-initiated-email':
        await this.emailService.sendMail({
          to: job.data.email ?? 'noreply@paylink.mw',
          subject: 'Refund Initiated — PayLink',
          template: 'refund-initiated',
          context: job.data,
        });
        break;
      case 'send-refund-completed-email':
        await this.emailService.sendMail({
          to: job.data.email ?? 'noreply@paylink.mw',
          subject: 'Refund Completed — PayLink',
          template: 'refund-completed',
          context: job.data,
        });
        break;
      case 'send-refund-failed-email':
        await this.emailService.sendMail({
          to: job.data.email ?? 'noreply@paylink.mw',
          subject: 'Refund Failed — PayLink',
          template: 'refund-failed',
          context: job.data,
        });
        break;
      default:
        this.logger.warn(`Unknown email job: ${job.name}`);
    }
  }
}
