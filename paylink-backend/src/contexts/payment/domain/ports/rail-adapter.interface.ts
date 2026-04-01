export interface RailDepositParams {
  depositId: string;
  phoneNumber: string;
  amount: string;
  currency: string;
  providerCode: string;
  customerMessage: string;
  clientReference?: string;
  metadata?: Record<string, unknown>[];
}

export interface RailDepositResult {
  externalRef: string;
  status: 'ACCEPTED' | 'DUPLICATE_IGNORED' | 'REJECTED';
  failureCode?: string;
  failureMsg?: string;
}

export interface RailPayoutParams {
  payoutId: string;
  phoneNumber: string;
  amount: string;
  currency: string;
  providerCode: string;
  customerMessage: string;
  metadata?: Record<string, unknown>[];
}

export interface RailPayoutResult {
  externalRef: string;
  status: 'ACCEPTED' | 'DUPLICATE_IGNORED' | 'REJECTED';
  failureCode?: string;
}

export interface RailRefundParams {
  refundId: string;
  depositId: string;
  amount: string;
  currency: string;
  metadata?: Record<string, unknown>[];
}

export interface RailRefundResult {
  externalRef: string;
  status: 'ACCEPTED' | 'DUPLICATE_IGNORED' | 'REJECTED';
  failureCode?: string;
}

export type RailDepositStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type RailRefundStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface RailAvailability {
  available: boolean;
  reason?: string;
}

/**
 * @description The only contract any payment rail must satisfy.
 * Adding a new rail = implement this interface + register in RailRouterService.
 * No other code changes required.
 */
export interface IRailAdapter {
  readonly railId: string;
  initiateDeposit(params: RailDepositParams): Promise<RailDepositResult>;
  initiatePayout(params: RailPayoutParams): Promise<RailPayoutResult>;
  initiateRefund(params: RailRefundParams): Promise<RailRefundResult>;
  getDepositStatus(externalRef: string): Promise<RailDepositStatus>;
  getRefundStatus(externalRef: string): Promise<RailRefundStatus>;
  predictProvider(phoneNumber: string): Promise<string | null>;
  checkAvailability(country: string): Promise<RailAvailability>;
}
