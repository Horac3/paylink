import { useCallback, useReducer } from 'react'
import type { PublicLink, InitiatePaymentBody } from '../api/payment'
import { initiatePayment } from '../api/payment'
import type { FlowType } from '../utils/detectFlow'

/* ─── State machine types ────────────────────────────────────────────────── */

export type PaymentState =
  | { status: 'loading' }
  | { status: 'ready'; link: PublicLink; flow: FlowType }
  | { status: 'confirming'; link: PublicLink; flow: FlowType }
  | { status: 'polling'; txnId: string; expiresAt: number; link: PublicLink; flow: FlowType }
  | { status: 'success'; txnId: string; reference?: string; link: PublicLink }
  | { status: 'failed'; reason: string; link: PublicLink; flow: FlowType }
  | { status: 'timeout'; link: PublicLink; flow: FlowType }
  | { status: 'error'; message: string }

type Action =
  | { type: 'LINK_LOADED'; link: PublicLink; flow: FlowType }
  | { type: 'LINK_ERROR'; message: string }
  | { type: 'CONFIRM_START' }
  | { type: 'POLLING_START'; txnId: string }
  | { type: 'PAYMENT_SUCCESS'; txnId: string; reference?: string }
  | { type: 'PAYMENT_FAILED'; reason: string }
  | { type: 'TIMEOUT' }
  | { type: 'RETRY'; link: PublicLink; flow: FlowType }
  | { type: 'SWITCH_TO_GUEST'; link: PublicLink }

const EMPTY_LINK: PublicLink = {
  id: '',
  slug: '',
  type: 'INVOICE',
  amount: null,
  currency: 'MWK',
  status: 'ACTIVE',
  expiresAt: null,
  metadata: null,
  merchantId: '',
}

function extractLink(state: PaymentState): PublicLink {
  if (
    state.status === 'ready' ||
    state.status === 'confirming' ||
    state.status === 'polling' ||
    state.status === 'success' ||
    state.status === 'failed' ||
    state.status === 'timeout'
  ) {
    return state.link
  }
  return EMPTY_LINK
}

function extractFlow(state: PaymentState): FlowType {
  if (
    state.status === 'ready' ||
    state.status === 'confirming' ||
    state.status === 'polling' ||
    state.status === 'failed' ||
    state.status === 'timeout'
  ) {
    return state.flow
  }
  return 'GUEST'
}

function reducer(state: PaymentState, action: Action): PaymentState {
  switch (action.type) {
    case 'LINK_LOADED':
      return { status: 'ready', link: action.link, flow: action.flow }
    case 'LINK_ERROR':
      return { status: 'error', message: action.message }
    case 'CONFIRM_START':
      return { status: 'confirming', link: extractLink(state), flow: extractFlow(state) }
    case 'POLLING_START':
      return {
        status: 'polling',
        txnId: action.txnId,
        expiresAt: Date.now() + 180_000,
        link: extractLink(state),
        flow: extractFlow(state),
      }
    case 'PAYMENT_SUCCESS':
      return { status: 'success', txnId: action.txnId, reference: action.reference, link: extractLink(state) }
    case 'PAYMENT_FAILED':
      return { status: 'failed', reason: action.reason, link: extractLink(state), flow: extractFlow(state) }
    case 'TIMEOUT':
      return { status: 'timeout', link: extractLink(state), flow: extractFlow(state) }
    case 'RETRY':
      return { status: 'ready', link: action.link, flow: action.flow }
    case 'SWITCH_TO_GUEST':
      return { status: 'ready', link: action.link, flow: 'GUEST' }
    default:
      return state
  }
}

/* ─── Hook interface ─────────────────────────────────────────────────────── */

export interface UsePaymentFlowReturn {
  state: PaymentState
  loadLink: (link: PublicLink, flow: FlowType) => void
  setError: (message: string) => void
  confirm: (slug: string, body: InitiatePaymentBody) => Promise<void>
  retry: (link: PublicLink, flow: FlowType) => void
  switchToGuest: (link: PublicLink) => void
  onPollingSuccess: (txnId: string, reference?: string) => void
  onPollingFailed: (reason: string) => void
  onPollingTimeout: () => void
}

export function usePaymentFlow(): UsePaymentFlowReturn {
  const [state, dispatch] = useReducer(reducer, { status: 'loading' })

  const loadLink = useCallback((link: PublicLink, flow: FlowType) => {
    dispatch({ type: 'LINK_LOADED', link, flow })
  }, [])

  const setError = useCallback((message: string) => {
    dispatch({ type: 'LINK_ERROR', message })
  }, [])

  const confirm = useCallback(async (slug: string, body: InitiatePaymentBody) => {
    dispatch({ type: 'CONFIRM_START' })
    try {
      const result = await initiatePayment(slug, body)
      dispatch({ type: 'POLLING_START', txnId: result.transactionId })
    } catch (err: unknown) {
      let reason = 'Payment initiation failed. Please try again.'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        if (axiosErr.response?.data?.message) {
          reason = axiosErr.response.data.message
        }
      }
      dispatch({ type: 'PAYMENT_FAILED', reason })
    }
  }, [])

  const retry = useCallback((link: PublicLink, flow: FlowType) => {
    dispatch({ type: 'RETRY', link, flow })
  }, [])

  const switchToGuest = useCallback((link: PublicLink) => {
    dispatch({ type: 'SWITCH_TO_GUEST', link })
  }, [])

  const onPollingSuccess = useCallback((txnId: string, reference?: string) => {
    dispatch({ type: 'PAYMENT_SUCCESS', txnId, reference })
  }, [])

  const onPollingFailed = useCallback((reason: string) => {
    dispatch({ type: 'PAYMENT_FAILED', reason })
  }, [])

  const onPollingTimeout = useCallback(() => {
    dispatch({ type: 'TIMEOUT' })
  }, [])

  return {
    state,
    loadLink,
    setError,
    confirm,
    retry,
    switchToGuest,
    onPollingSuccess,
    onPollingFailed,
    onPollingTimeout,
  }
}
