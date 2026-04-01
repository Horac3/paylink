import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetLinkAnalyticsQuery,
  GetMerchantAnalyticsQuery,
} from '../application/queries/get-analytics.query';
import { CurrentMerchant } from '@shared/decorators/current-merchant.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('links/:id')
  @ApiOperation({ summary: 'Get analytics snapshot for a specific link' })
  async getLinkAnalytics(
    @Param('id') id: string,
    @CurrentMerchant() merchantId: string,
  ) {
    return this.queryBus.execute(new GetLinkAnalyticsQuery(id, merchantId));
  }

  @Get('merchant')
  @ApiOperation({
    summary: 'Get aggregated analytics across all merchant links',
  })
  async getMerchantAnalytics(@CurrentMerchant() merchantId: string) {
    return this.queryBus.execute(new GetMerchantAnalyticsQuery(merchantId));
  }
}
