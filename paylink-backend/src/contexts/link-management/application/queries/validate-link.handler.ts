import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ValidateLinkQuery, ValidatedLink } from './validate-link.query';
import {
  ILinkRepository,
  LINK_REPOSITORY,
} from '../../domain/ports/link-repository.interface';
import { NotFoundError } from '@shared/errors/not-found.error';
import { DomainError } from '@shared/errors/domain.error';

@QueryHandler(ValidateLinkQuery)
export class ValidateLinkHandler implements IQueryHandler<ValidateLinkQuery> {
  constructor(
    @Inject(LINK_REPOSITORY) private readonly repo: ILinkRepository,
  ) {}

  async execute(query: ValidateLinkQuery): Promise<ValidatedLink> {
    const link = await this.repo.findBySlug(query.slug);
    if (!link) throw new NotFoundError('PaymentLink', query.slug);
    if (!link.isActive())
      throw new DomainError(`Payment link is not active: ${link.status}`);

    return {
      linkId: link.id,
      merchantId: link.merchantId.value,
      amount: link.amount?.toString() ?? null,
      currency: link.currency,
      type: link.type,
    };
  }
}
