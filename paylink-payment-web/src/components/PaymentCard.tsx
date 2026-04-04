import { useCallback } from 'react'
import type { PaymentState } from '../hooks/usePaymentFlow'
import type { PublicLink, InitiatePaymentBody } from '../api/payment'
import type { FlowType } from '../utils/detectFlow'
import { usePaymentStatus } from '../hooks/usePaymentStatus'
import { detectProvider } from '../utils/detectProvider'
import type { Provider } from '../utils/detectProvider'
import { ReadyScreen } from './screens/ReadyScreen'
import { PollingScreen } from './screens/PollingScreen'
import { SuccessScreen } from './screens/SuccessScreen'
import { FailedScreen } from './screens/FailedScreen'
import { ErrorScreen } from './screens/ErrorScreen'
import { AppBanner } from './AppBanner'

/* ─── PayLink logo ───────────────────────────────────────────────────────── */
function PayLinkLogo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-bold text-lg text-primary tracking-tight">PayLink</span>
    </div>
  )
}

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto" />
      <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="h-px bg-gray-100" />
      <div className="h-14 bg-gray-100 rounded-xl" />
      <div className="h-12 bg-gray-200 rounded-xl" />
    </div>
  )
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface PaymentCardProps {
  state: PaymentState
  recipientToken: string | null
  onConfirm: (slug: string, body: InitiatePaymentBody) => Promise<void>
  onRetry: (link: PublicLink, flow: FlowType) => void
  onSwitchToGuest: (link: PublicLink) => void
  onPollingSuccess: (txnId: string, reference?: string) => void
  onPollingFailed: (reason: string) => void
  onPollingTimeout: () => void
  slug: string
}

/**
 * Main container that renders the correct screen based on payment state.
 */
export function PaymentCard({
  state,
  recipientToken,
  onConfirm,
  onRetry,
  onSwitchToGuest,
  onPollingSuccess,
  onPollingFailed,
  onPollingTimeout,
  slug,
}: PaymentCardProps) {
  // Extract txnId only when polling
  const txnId = state.status === 'polling' ? state.txnId : null

  usePaymentStatus({
    txnId,
    onSuccess: (reference?: string) => {
      onPollingSuccess(txnId ?? '', reference)
    },
    onFailed: onPollingFailed,
    onTimeout: onPollingTimeout,
  })

  // Derive current flow for AppBanner
  const currentFlow: FlowType =
    state.status === 'ready' ||
    state.status === 'confirming' ||
    state.status === 'polling' ||
    state.status === 'failed' ||
    state.status === 'timeout'
      ? state.flow
      : recipientToken
        ? 'RECIPIENT'
        : 'GUEST'

  // Masked number + provider from recipient token (JWT decoded minimally)
  const { maskedNumber, provider: recipientProvider } = useRecipientInfo(recipientToken)

  // Handlers
  const handleConfirmRecipient = useCallback(() => {
    if (!recipientToken) return
    void onConfirm(slug, { recipientToken })
  }, [onConfirm, recipientToken, slug])

  const handleConfirmGuest = useCallback(
    (msisdn: string, provider: string | undefined, _amount?: string) => {
      const body: InitiatePaymentBody = { msisdn, ...(provider ? { providerCode: provider } : {}) }
      void onConfirm(slug, body)
    },
    [onConfirm, slug],
  )

  const handleSwitchToGuest = useCallback(() => {
    if (
      state.status === 'ready' ||
      state.status === 'confirming' ||
      state.status === 'polling' ||
      state.status === 'failed' ||
      state.status === 'timeout'
    ) {
      onSwitchToGuest(state.link)
    }
  }, [onSwitchToGuest, state])

  const handleRetry = useCallback(() => {
    if (
      state.status === 'failed' ||
      state.status === 'timeout'
    ) {
      onRetry(state.link, state.flow)
    } else if (state.status === 'ready') {
      onRetry(state.link, state.flow)
    }
  }, [onRetry, state])

  const handleCancelPolling = useCallback(() => {
    onPollingFailed('Payment cancelled.')
  }, [onPollingFailed])

  const showBanner =
    state.status === 'ready' ||
    state.status === 'confirming' ||
    state.status === 'polling' ||
    state.status === 'success'

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 pb-8">
          <PayLinkLogo />

          {state.status === 'loading' && <LoadingSkeleton />}

          {state.status === 'ready' && (
            <ReadyScreen
              link={state.link}
              flow={state.flow}
              recipientToken={recipientToken}
              maskedNumber={maskedNumber}
              recipientProvider={recipientProvider}
              isConfirming={false}
              onConfirmRecipient={handleConfirmRecipient}
              onConfirmGuest={handleConfirmGuest}
              onSwitchToGuest={handleSwitchToGuest}
            />
          )}

          {state.status === 'confirming' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <svg
                className="w-8 h-8 animate-spin-smooth text-accent"
                viewBox="0 0 24 24"
                fill="none"
                aria-label="Processing"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-muted">Setting up your payment…</p>
            </div>
          )}

          {state.status === 'polling' && (
            <PollingScreen
              link={state.link}
              expiresAt={state.expiresAt}
              onCancel={handleCancelPolling}
            />
          )}

          {state.status === 'success' && (
            <SuccessScreen
              link={state.link}
              reference={state.reference}
            />
          )}

          {state.status === 'failed' && (
            <FailedScreen
              reason={state.reason}
              onRetry={handleRetry}
              onSwitchToGuest={handleSwitchToGuest}
              canSwitchToGuest={state.flow === 'RECIPIENT'}
            />
          )}

          {state.status === 'timeout' && (
            <FailedScreen
              reason="The payment prompt expired. Please try again."
              onRetry={handleRetry}
              onSwitchToGuest={handleSwitchToGuest}
              canSwitchToGuest={state.flow === 'RECIPIENT'}
            />
          )}

          {state.status === 'error' && <ErrorScreen message={state.message} />}
        </div>

        {/* Spacer for fixed banner */}
        {showBanner && <div className="h-16" />}
      </div>

      {showBanner && <AppBanner flow={currentFlow} />}
    </div>
  )
}

/* ─── Recipient info extraction ─────────────────────────────────────────── */

/**
 * Decodes the recipient token (JWT) to extract masked number and provider.
 * The token payload is base64-encoded JSON — we only need the `msisdn` field.
 */
function useRecipientInfo(token: string | null): { maskedNumber: string; provider: Provider } {
  if (!token) return { maskedNumber: '0000', provider: null }

  try {
    const parts = token.split('.')
    if (parts.length < 2) return { maskedNumber: '0000', provider: null }
    const payload = JSON.parse(atob(parts[1]!)) as Record<string, unknown>
    const msisdn = typeof payload['msisdn'] === 'string' ? payload['msisdn'] : ''
    const last4 = msisdn.slice(-4) || '0000'
    const provider = detectProvider(msisdn)
    return { maskedNumber: last4, provider }
  } catch {
    return { maskedNumber: '0000', provider: null }
  }
}
