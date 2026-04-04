import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response } from 'express';
import { InitiatePaymentCommand } from '../application/commands/initiate-payment.command';
import { PublicRoute } from '@shared/decorators/public-route.decorator';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../domain/ports/transaction-repository.interface';
import { Inject } from '@nestjs/common';
import { PaymentSseService } from '../infrastructure/payment-sse.service';

class InitiatePaymentDto {
  @ApiProperty({ required: false, description: 'Strategy A — registered payer session token' })
  @IsOptional()
  @IsString()
  payerSessionToken?: string;

  @ApiProperty({ required: false, description: 'Strategy B — pre-filled recipient JWT from ?r= URL param' })
  @IsOptional()
  @IsString()
  recipientToken?: string;

  @ApiProperty({ required: false, description: 'Strategy C — guest MSISDN in E.164 format' })
  @IsOptional()
  @IsString()
  msisdn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  providerCode?: string;
}

@ApiTags('pay')
@Controller('pay')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly txnRepo: ITransactionRepository,
    private readonly sseService: PaymentSseService,
  ) {}

  @PublicRoute()
  @Post(':slug/initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate a payment for a link slug' })
  async initiate(@Param('slug') slug: string, @Body() dto: InitiatePaymentDto) {
    return this.commandBus.execute(
      new InitiatePaymentCommand(
        slug,
        dto.payerSessionToken ?? null,
        dto.msisdn ?? null,
        dto.providerCode ?? null,
        null,
        dto.recipientToken ?? null,
      ),
    );
  }

  @PublicRoute()
  @Get('status/:txnId')
  @ApiOperation({ summary: 'Poll transaction status (fallback)' })
  async getStatus(@Param('txnId') txnId: string) {
    const txn = await this.txnRepo.findById(txnId);
    if (!txn) return { status: 'NOT_FOUND' };
    return {
      transactionId: txn.id,
      status: txn.status,
      externalRef: txn.externalRef,
    };
  }

  /**
   * SSE stream — client connects once after initiating payment and waits.
   * The server pushes exactly one event when the payment settles or fails,
   * then closes the stream. Times out after 5 minutes.
   *
   * If the transaction is already settled when the client connects (race between
   * PawaPay callback and page load), we push the result immediately.
   */
  @PublicRoute()
  @Sse('events/:txnId')
  @ApiOperation({ summary: 'SSE stream for real-time payment status' })
  async paymentEvents(
    @Param('txnId') txnId: string,
    @Res() res: Response,
  ): Promise<Observable<MessageEvent>> {
    // If already settled, emit immediately without waiting
    const txn = await this.txnRepo.findById(txnId);
    if (txn && txn.status !== 'PENDING') {
      const event: MessageEvent = {
        data: {
          status: txn.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
          reference: txn.externalRef ?? undefined,
        },
      } as MessageEvent;
      return new Observable((obs) => {
        obs.next(event);
        obs.complete();
      });
    }

    const subject = this.sseService.getOrCreate(txnId);

    // Auto-close after 5 min so the server doesn't hold the stream forever
    const timeout = setTimeout(() => {
      this.sseService.remove(txnId);
    }, 5 * 60 * 1000);

    res.on('close', () => {
      clearTimeout(timeout);
      this.sseService.remove(txnId);
    });

    return subject.asObservable().pipe(
      map((event) => ({ data: event }) as MessageEvent),
    );
  }
}
