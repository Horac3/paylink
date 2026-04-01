import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '@shared/decorators/public-route.decorator';

@ApiTags('callbacks')
@Controller('callback')
@PublicRoute()
export class CallbackController {
  private readonly logger = new Logger(CallbackController.name);

  constructor(
    @InjectQueue('payment-callbacks') private readonly callbackQueue: Queue,
  ) {}

  /**
   * @description PawaPay deposit callback. Responds 200 IMMEDIATELY — all logic in BullMQ.
   */
  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'PawaPay deposit callback — responds immediately, processes async',
  })
  async depositCallback(@Body() body: DepositCallbackBody) {
    this.logger.log(
      `[CALLBACK] deposit received depositId=${body.depositId} status=${body.status}`,
    );
    await this.callbackQueue.add('process-deposit-callback', {
      depositId: body.depositId,
      status: body.status,
      externalRef: body.depositId,
      failureCode: body.failureReason?.failureCode,
    });
    return { received: true };
  }

  @Post('payouts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'PawaPay payout callback' })
  async payoutCallback(@Body() body: PayoutCallbackBody) {
    this.logger.log(
      `[CALLBACK] payout received payoutId=${body.payoutId} status=${body.status}`,
    );
    await this.callbackQueue.add('process-payout-callback', {
      payoutId: body.payoutId,
      status: body.status,
    });
    return { received: true };
  }

  @Post('refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'PawaPay refund callback' })
  async refundCallback(@Body() body: RefundCallbackBody) {
    this.logger.log(
      `[CALLBACK] refund received refundId=${body.refundId} status=${body.status}`,
    );
    await this.callbackQueue.add('process-refund-callback', {
      refundId: body.refundId,
      depositId: body.depositId,
      status: body.status,
      failureCode: body.failureReason?.failureCode,
    });
    return { received: true };
  }
}

interface DepositCallbackBody {
  depositId: string;
  status: 'COMPLETED' | 'FAILED';
  amount?: string;
  currency?: string;
  failureReason?: { failureCode?: string; failureMessage?: string };
}

interface PayoutCallbackBody {
  payoutId: string;
  status: 'COMPLETED' | 'FAILED';
  failureReason?: { failureCode?: string };
}

interface RefundCallbackBody {
  refundId: string;
  depositId: string;
  status: 'COMPLETED' | 'FAILED';
  failureReason?: { failureCode?: string };
}
