import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  GetPayerProfileQuery,
  PayerProfileReadModel,
} from './get-payer-profile.query';
import {
  IPayerRepository,
  PAYER_REPOSITORY,
} from '../../domain/ports/payer-repository.interface';
import { PayerId } from '@shared/domain/payer-id.vo';
import { NotFoundError } from '@shared/errors/not-found.error';

@QueryHandler(GetPayerProfileQuery)
export class GetPayerProfileHandler implements IQueryHandler<GetPayerProfileQuery> {
  constructor(
    @Inject(PAYER_REPOSITORY) private readonly repo: IPayerRepository,
  ) {}

  async execute(query: GetPayerProfileQuery): Promise<PayerProfileReadModel> {
    const payer = await this.repo.findById(PayerId.create(query.payerId));
    if (!payer) throw new NotFoundError('PayerAccount', query.payerId);
    return {
      id: payer.id.value,
      email: payer.email,
      msisdnHint: payer.msisdnHint,
      preferredRail: payer.preferredRail,
      preferredProvider: payer.preferredProvider,
      verified: payer.verified,
    };
  }
}
