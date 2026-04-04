export interface Merchant {
  id: string;
  email: string;
  businessName: string;
  feeTier: string;
  webhookUrl?: string;
  createdAt: string;
}

export type LinkType = 'INVOICE' | 'SUBSCRIPTION' | 'DONATION' | 'REQUEST';
export type LinkStatus = 'ACTIVE' | 'PAID' | 'EXPIRED' | 'CANCELLED';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type Rail = 'AIRTEL' | 'TNM' | 'UNKNOWN';
export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PaymentLink {
  id: string;
  slug: string;
  type: LinkType;
  status: LinkStatus;
  amount: number;
  currency: string;
  description?: string;
  expiresAt?: string;
  metadata?: Record<string, string>;
  recipientPhone?: string;
  recipientProvider?: string;
  recurrenceInterval?: string;
  recurrenceMaxCycles?: number;
  standardUrl: string;
  prefilledUrl?: string;
  qrCodeUrl?: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  linkId: string;
  merchantId: string;
  status: TransactionStatus;
  rail: Rail;
  providerCode?: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  transactionId: string;
  merchantId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DailyVolume {
  date: string;
  volume: number;
  count: number;
}

export interface RailDistribution {
  rail: string;
  count: number;
  volume: number;
}

export interface MerchantAnalytics {
  totalCollectedToday: number;
  totalCollectedThisMonth: number;
  activeLinksCount: number;
  refundsThisMonth: number;
  dailyVolume: DailyVolume[];
  railDistribution: RailDistribution[];
  topLinks: Array<{
    id: string;
    slug: string;
    type: string;
    totalCollected: number;
    transactionCount: number;
  }>;
}

export interface LinkAnalytics {
  linkId: string;
  totalCollected: number;
  transactionCount: number;
  dailyVolume: DailyVolume[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  merchant: Merchant;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
