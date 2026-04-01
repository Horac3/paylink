import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetLinkAnalyticsQuery,
  GetMerchantAnalyticsQuery,
} from './get-analytics.query';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { NotFoundError } from '@shared/errors/not-found.error';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

@QueryHandler(GetLinkAnalyticsQuery)
export class GetLinkAnalyticsHandler implements IQueryHandler<GetLinkAnalyticsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetLinkAnalyticsQuery) {
    const link = await this.prisma.paymentLink.findUnique({
      where: { id: query.linkId },
      include: { analyticsSnapshot: true },
    });
    if (!link) throw new NotFoundError('PaymentLink', query.linkId);
    if (link.merchantId !== query.merchantId)
      throw new UnauthorisedError('Not your link');

    return (
      link.analyticsSnapshot ?? {
        linkId: query.linkId,
        emailsSent: 0,
        paymentStarts: 0,
        conversions: 0,
        failures: 0,
        refunds: 0,
        conversionRate: 0,
      }
    );
  }
}

@QueryHandler(GetMerchantAnalyticsQuery)
export class GetMerchantAnalyticsHandler implements IQueryHandler<GetMerchantAnalyticsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetMerchantAnalyticsQuery) {
    const snapshots = await this.prisma.analyticsSnapshot.findMany({
      where: { link: { merchantId: query.merchantId } },
    });
    return {
      totalLinks: snapshots.length,
      totalPaymentStarts: snapshots.reduce((s, r) => s + r.paymentStarts, 0),
      totalConversions: snapshots.reduce((s, r) => s + r.conversions, 0),
      totalFailures: snapshots.reduce((s, r) => s + r.failures, 0),
      totalRefunds: snapshots.reduce((s, r) => s + r.refunds, 0),
      overallConversionRate:
        snapshots.length > 0
          ? snapshots.reduce((s, r) => s + Number(r.conversionRate), 0) /
            snapshots.length
          : 0,
    };
  }
}
