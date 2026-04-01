import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ResolvePayerQuery, ResolvedPayer } from './resolve-payer.query';
import {
  IPayerRepository,
  PAYER_REPOSITORY,
} from '../../domain/ports/payer-repository.interface';
import { MsisdnEncryptionService } from '../../infrastructure/msisdn-encryption.service';
import { PayerId } from '@shared/domain/payer-id.vo';
import { NotFoundError } from '@shared/errors/not-found.error';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';

/**
 * @description The ONLY handler that decrypts MSISDN.
 * Called exclusively by Payment context via QueryBus before STK push.
 */
@QueryHandler(ResolvePayerQuery)
export class ResolvePayerHandler implements IQueryHandler<ResolvePayerQuery> {
  private readonly logger = new Logger(ResolvePayerHandler.name);

  constructor(
    @Inject(PAYER_REPOSITORY) private readonly repo: IPayerRepository,
    private readonly encryption: MsisdnEncryptionService,
  ) {}

  async execute(query: ResolvePayerQuery): Promise<ResolvedPayer> {
    const payer = await this.repo.findById(PayerId.create(query.payerId));
    if (!payer) throw new NotFoundError('PayerAccount', query.payerId);
    if (!payer.verified)
      throw new UnauthorisedError('Payer MSISDN not verified');

    const msisdn = this.encryption.decrypt(payer.msisdnEncrypted);
    this.logger.debug(`MSISDN resolved for payer ****${payer.msisdnHint}`);

    return {
      payerId: payer.id.value,
      msisdn,
      preferredRail: payer.preferredRail,
      preferredProvider: payer.preferredProvider,
    };
  }
}
