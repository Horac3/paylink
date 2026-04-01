import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLinkBySlugQuery } from '../application/queries/get-link.query';
import { PublicRoute } from '@shared/decorators/public-route.decorator';

@ApiTags('pay')
@Controller('pay')
export class PayController {
  constructor(private readonly queryBus: QueryBus) {}

  @PublicRoute()
  @Get(':slug')
  @ApiOperation({ summary: 'Get public payment link data by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.queryBus.execute(new GetLinkBySlugQuery(slug));
  }
}
