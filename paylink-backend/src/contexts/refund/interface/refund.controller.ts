import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { InitiateRefundDto } from './dtos/initiate-refund.dto';
import { InitiateRefundCommand } from '../application/commands/initiate-refund.command';
import {
  GetRefundQuery,
  ListRefundsQuery,
} from '../application/queries/get-refund.query';
import { CurrentMerchant } from '@shared/decorators/current-merchant.decorator';

@ApiTags('refunds')
@ApiBearerAuth()
@Controller('refunds')
export class RefundController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Initiate a refund' })
  async initiate(
    @CurrentMerchant() merchantId: string,
    @Body() dto: InitiateRefundDto,
  ) {
    return this.commandBus.execute(
      new InitiateRefundCommand(
        dto.transactionId,
        merchantId,
        dto.amount,
        dto.reason,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund by ID' })
  async getOne(@Param('id') id: string, @CurrentMerchant() merchantId: string) {
    return this.queryBus.execute(new GetRefundQuery(id, merchantId));
  }

  @Get()
  @ApiOperation({ summary: 'List refunds (merchant-scoped, paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @CurrentMerchant() merchantId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.queryBus.execute(
      new ListRefundsQuery(merchantId, +page, +limit),
    );
  }
}
