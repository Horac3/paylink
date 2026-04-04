import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

const http = axios.create({ baseURL: BASE_URL, timeout: 15_000 })

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface PublicLink {
  id: string
  slug: string
  type: 'INVOICE' | 'SUBSCRIPTION' | 'DONATION' | 'REQUEST'
  amount: string | null
  currency: string
  status: 'ACTIVE' | 'EXPIRED' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED'
  expiresAt: string | null
  metadata: Record<string, unknown> | null
  merchantId: string
}

export interface InitiatePaymentRecipientBody {
  recipientToken: string
}

export interface InitiatePaymentGuestBody {
  msisdn: string
  providerCode?: string
}

export type InitiatePaymentBody = InitiatePaymentRecipientBody | InitiatePaymentGuestBody

export interface InitiatePaymentResponse {
  transactionId: string
  status: string
}

export interface TransactionStatus {
  transactionId: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'NOT_FOUND'
  externalRef?: string
}

/* ─── API calls ──────────────────────────────────────────────────────────── */

/**
 * GET /pay/:slug — fetch public link data.
 * Maps to the backend PayController.getBySlug endpoint.
 */
export async function getPublicLink(slug: string): Promise<PublicLink> {
  const res = await http.get<PublicLink>(`/pay/${slug}`)
  return res.data
}

/**
 * POST /pay/:slug/initiate — initiate a payment.
 */
export async function initiatePayment(
  slug: string,
  body: InitiatePaymentBody,
): Promise<InitiatePaymentResponse> {
  const res = await http.post<InitiatePaymentResponse>(`/pay/${slug}/initiate`, body)
  return res.data
}

/**
 * GET /pay/status/:txnId — poll transaction status.
 */
export async function getStatus(txnId: string): Promise<TransactionStatus> {
  const res = await http.get<TransactionStatus>(`/pay/status/${txnId}`)
  return res.data
}
