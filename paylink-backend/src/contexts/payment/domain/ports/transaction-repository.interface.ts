import { Transaction } from '../transaction.aggregate';

export interface TransactionListParams {
  merchantId: string;
  page: number;
  limit: number;
  status?: string;
  from?: Date;
  to?: Date;
}

export interface TransactionListResult {
  data: Transaction[];
  meta: { page: number; limit: number; total: number };
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByExternalRef(externalRef: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
  listByMerchant(params: TransactionListParams): Promise<TransactionListResult>;
}

export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository');
