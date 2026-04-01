import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLinkQuery, GetLinkBySlugQuery } from './get-link.query';
import {
  ILinkRepository,
  LINK_REPOSITORY,
} from '../../domain/ports/link-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';

@QueryHandler(GetLinkQuery)
export class GetLinkHandler implements IQueryHandler<GetLinkQuery> {
  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
  ) {}

  async execute(query: GetLinkQuery) {
    const link = await this.repo.findById(query.linkId);
    if (!link) throw new NotFoundError('PaymentLink', query.linkId);
    return {
      id: link.id,
      slug: link.slug.value,
      type: link.type,
      status: link.status,
      amount: link.amount?.toString() ?? null,
      currency: link.currency,
      expiresAt: link.expiresAt,
      qrCodeBase64: link.qrCodeBase64,
      metadata: link.metadata,
    };
  }
}

@QueryHandler(GetLinkBySlugQuery)
export class GetLinkBySlugHandler implements IQueryHandler<GetLinkBySlugQuery> {
  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
  ) {}

  async execute(query: GetLinkBySlugQuery) {
    const link = await this.repo.findBySlug(query.slug);
    if (!link) throw new NotFoundError('PaymentLink', query.slug);
    return {
      id: link.id,
      slug: link.slug.value,
      type: link.type,
      status: link.status,
      amount: link.amount?.toString() ?? null,
      currency: link.currency,
      expiresAt: link.expiresAt,
      qrCodeBase64: link.qrCodeBase64,
      metadata: link.metadata,
      merchantId: link.merchantId.value,
    };
  }
}
