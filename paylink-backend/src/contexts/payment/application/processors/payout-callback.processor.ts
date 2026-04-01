// payout-callback.processor.ts — simplified, not a WorkerHost
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PayoutCallbackProcessor {
  private readonly logger = new Logger(PayoutCallbackProcessor.name);

  handlePayoutCallback(data: { payoutId: string; status: string }): void {
    this.logger.log(`Payout callback: ${data.payoutId} status=${data.status}`);
  }
}
