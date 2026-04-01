import { PayerAccount } from '../payer-account.aggregate';
import { PayerId } from '@shared/domain/payer-id.vo';

export interface IPayerRepository {
  findById(id: PayerId): Promise<PayerAccount | null>;
  findByEmail(email: string): Promise<PayerAccount | null>;
  findByMsisdnHash(hash: string): Promise<PayerAccount | null>;
  save(payer: PayerAccount): Promise<void>;
}

export const PAYER_REPOSITORY = Symbol('IPayerRepository');
