import { Transaction } from '../transaction.aggregate';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByExternalRef(externalRef: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}

export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');
