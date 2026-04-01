import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InitiatePaymentCommand } from '../application/commands/initiate-payment.command';
import { PublicRoute } from '@shared/decorators/public-route.decorator';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../domain/ports/transaction-repository.interface';
import { Inject } from '@nestjs/common';

class InitiatePaymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  payerSessionToken?: string;

  @ApiProperty({ required: false })
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
      ),
    );
  }

  @PublicRoute()
  @Get('status/:txnId')
  @ApiOperation({ summary: 'Poll transaction status' })
  async getStatus(@Param('txnId') txnId: string) {
    const txn = await this.txnRepo.findById(txnId);
    if (!txn) return { status: 'NOT_FOUND' };
    return {
      transactionId: txn.id,
      status: txn.status,
      externalRef: txn.externalRef,
    };
  }
}
