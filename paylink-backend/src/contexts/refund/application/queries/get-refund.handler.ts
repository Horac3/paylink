import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetRefundQuery, ListRefundsQuery } from './get-refund.query';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/ports/refund-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

@QueryHandler(GetRefundQuery)
export class GetRefundHandler implements IQueryHandler<GetRefundQuery> {
  constructor(
    @Inject(REFUND_REPOSITORY) private readonly repo: IRefundRepository,
  ) {}

  async execute(query: GetRefundQuery) {
    const refund = await this.repo.findById(query.refundId);
    if (!refund) throw new NotFoundError('Refund', query.refundId);
    if (refund.merchantId !== query.merchantId)
      throw new UnauthorisedError('Not your refund');
    return {
      id: refund.id,
      transactionId: refund.transactionId,
      amount: refund.amount.toString(),
      currency: refund.currency,
      status: refund.status,
      reason: refund.reason,
      resolvedAt: refund.resolvedAt,
    };
  }
}

@QueryHandler(ListRefundsQuery)
export class ListRefundsHandler implements IQueryHandler<ListRefundsQuery> {
  constructor(
    @Inject(REFUND_REPOSITORY) private readonly repo: IRefundRepository,
  ) {}

  async execute(query: ListRefundsQuery) {
    const { items, total } = await this.repo.findByMerchant(
      query.merchantId,
      query.page,
      query.limit,
    );
    return {
      items: items.map((r) => ({
        id: r.id,
        transactionId: r.transactionId,
        amount: r.amount.toString(),
        currency: r.currency,
        status: r.status,
        reason: r.reason,
        resolvedAt: r.resolvedAt,
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
