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
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      collectedToday,
      collectedThisMonth,
      activeLinksCount,
      refundsAgg,
      txns30d,
      txnsAll,
    ] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { merchantId: query.merchantId, status: 'SUCCESS', createdAt: { gte: todayStart } },
        _sum: { netAmount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { merchantId: query.merchantId, status: 'SUCCESS', createdAt: { gte: monthStart } },
        _sum: { netAmount: true },
      }),
      this.prisma.paymentLink.count({
        where: { merchantId: query.merchantId, status: 'ACTIVE' },
      }),
      this.prisma.refund.aggregate({
        where: { merchantId: query.merchantId, createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      this.prisma.transaction.findMany({
        where: { merchantId: query.merchantId, status: 'SUCCESS', createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, netAmount: true, rail: true, linkId: true },
      }),
      this.prisma.transaction.findMany({
        where: { merchantId: query.merchantId, status: 'SUCCESS' },
        select: { netAmount: true, linkId: true },
      }),
    ]);

    // Daily volume — last 30 days
    const dailyMap = new Map<string, { volume: number; count: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { volume: 0, count: 0 });
    }
    for (const txn of txns30d) {
      const key = txn.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(key);
      if (entry) { entry.volume += Number(txn.netAmount); entry.count += 1; }
    }
    const dailyVolume = Array.from(dailyMap.entries()).map(([date, { volume, count }]) => ({ date, volume, count }));

    // Rail distribution — last 30 days
    const railMap = new Map<string, { count: number; volume: number }>();
    for (const txn of txns30d) {
      const e = railMap.get(txn.rail) ?? { count: 0, volume: 0 };
      e.count += 1; e.volume += Number(txn.netAmount);
      railMap.set(txn.rail, e);
    }
    const railDistribution = Array.from(railMap.entries()).map(([rail, { count, volume }]) => ({ rail, count, volume }));

    // Top 5 links by collected volume
    const linkMap = new Map<string, { totalCollected: number; transactionCount: number }>();
    for (const txn of txnsAll) {
      const e = linkMap.get(txn.linkId) ?? { totalCollected: 0, transactionCount: 0 };
      e.totalCollected += Number(txn.netAmount); e.transactionCount += 1;
      linkMap.set(txn.linkId, e);
    }
    const topLinkIds = Array.from(linkMap.entries())
      .sort((a, b) => b[1].totalCollected - a[1].totalCollected)
      .slice(0, 5)
      .map(([id]) => id);

    const topLinkDetails = await this.prisma.paymentLink.findMany({
      where: { id: { in: topLinkIds } },
      select: { id: true, slug: true, type: true },
    });

    const topLinks = topLinkDetails
      .map((link) => ({ ...link, ...(linkMap.get(link.id) ?? { totalCollected: 0, transactionCount: 0 }) }))
      .sort((a, b) => b.totalCollected - a.totalCollected);

    return {
      totalCollectedToday: Number(collectedToday._sum.netAmount ?? 0),
      totalCollectedThisMonth: Number(collectedThisMonth._sum.netAmount ?? 0),
      activeLinksCount,
      refundsThisMonth: Number(refundsAgg._sum.amount ?? 0),
      dailyVolume,
      railDistribution,
      topLinks,
    };
  }
}
