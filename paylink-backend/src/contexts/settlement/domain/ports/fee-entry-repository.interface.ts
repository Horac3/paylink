import { FeeEntryData } from '../fee-entry.value-object';

/**
 * @description Append-only ledger. No update, delete, or upsert.
 */
export interface IFeeEntryRepository {
  save(entry: FeeEntryData): Promise<void>;
  findByTransactionId(transactionId: string): Promise<FeeEntryData | null>;
}

export const FEE_ENTRY_REPOSITORY = Symbol('IFeeEntryRepository');
