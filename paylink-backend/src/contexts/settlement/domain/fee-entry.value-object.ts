import { Money } from '@shared/domain/money.vo';

export type FeeEntryType = 'CHARGE' | 'REFUND_REVERSAL';

export interface FeeEntryData {
  id: string;
  transactionId: string;
  merchantId: string;
  grossAmount: Money;
  feeRate: string;
  feeAmount: Money;
  netAmount: Money;
  type: FeeEntryType;
  refId: string | null;
}
