import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLinkDto } from './dtos/create-link.dto';
import { CreateLinkCommand } from '../application/commands/create-link.command';
import { CancelLinkCommand } from '../application/commands/cancel-link.command';
import { GetLinkQuery } from '../application/queries/get-link.query';
import { CurrentMerchant } from '@shared/decorators/current-merchant.decorator';

@ApiTags('links')
@ApiBearerAuth()
@Controller('links')
export class LinksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment link' })
  @ApiResponse({ status: 201 })
  async create(
    @CurrentMerchant() merchantId: string,
    @Body() dto: CreateLinkDto,
  ) {
    return this.commandBus.execute(
      new CreateLinkCommand(
        merchantId,
        dto.type,
        dto.amount ?? null,
        dto.currency,
        dto.recurrenceInterval ?? null,
        dto.maxCycles ?? null,
        dto.expiresAt ? new Date(dto.expiresAt) : null,
        dto.metadata ?? null,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment link by ID' })
  async getOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetLinkQuery(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a payment link' })
  async cancel(@Param('id') id: string, @CurrentMerchant() merchantId: string) {
    return this.commandBus.execute(new CancelLinkCommand(id, merchantId));
  }
}
