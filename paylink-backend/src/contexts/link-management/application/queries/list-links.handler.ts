import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListLinksQuery } from './list-links.query';
import {
  ILinkRepository,
  LINK_REPOSITORY,
} from '../../domain/ports/link-repository.interface';

@QueryHandler(ListLinksQuery)
export class ListLinksHandler implements IQueryHandler<ListLinksQuery> {
  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
  ) {}

  async execute(query: ListLinksQuery) {
    const { items, total } = await this.repo.findByMerchant(
      query.merchantId,
      query.page,
      query.limit,
      query.status,
    );

    return {
      data: items.map((link) => ({
        id: link.id,
        slug: link.slug.value,
        type: link.type,
        status: link.status,
        amount: link.amount?.toString() ?? null,
        currency: link.currency,
        expiresAt: link.expiresAt,
        metadata: link.metadata,
        createdAt: link.createdAt,
      })),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }
}
