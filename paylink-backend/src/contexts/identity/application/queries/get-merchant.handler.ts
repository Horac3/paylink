import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMerchantQuery, MerchantReadModel } from './get-merchant.query';
import {
  IMerchantRepository,
  MERCHANT_REPOSITORY,
} from '../../domain/ports/merchant-repository.interface';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { NotFoundError } from '@shared/errors/not-found.error';

@QueryHandler(GetMerchantQuery)
export class GetMerchantHandler implements IQueryHandler<GetMerchantQuery> {
  constructor(
    @Inject(MERCHANT_REPOSITORY) private readonly repo: IMerchantRepository,
  ) {}

  async execute(query: GetMerchantQuery): Promise<MerchantReadModel> {
    const merchant = await this.repo.findById(
      MerchantId.create(query.merchantId),
    );
    if (!merchant) throw new NotFoundError('Merchant', query.merchantId);
    return {
      id: merchant.id.value,
      email: merchant.email,
      businessName: merchant.businessName,
      feeTier: merchant.feeTier,
      createdAt: new Date(),
    };
  }
}
