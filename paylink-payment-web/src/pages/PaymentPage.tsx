import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getPublicLink } from '../api/payment'
import { usePaymentFlow } from '../hooks/usePaymentFlow'
import { detectFlow, getRecipientToken } from '../utils/detectFlow'
import { PaymentCard } from '../components/PaymentCard'
import { ErrorScreen } from '../components/screens/ErrorScreen'

/**
 * Top-level page for /pay/:slug
 * Loads link data, detects flow, renders PaymentCard.
 */
export function PaymentPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()

  const {
    state,
    loadLink,
    setError,
    confirm,
    retry,
    switchToGuest,
    onPollingSuccess,
    onPollingFailed,
    onPollingTimeout,
  } = usePaymentFlow()

  const recipientToken = getRecipientToken(searchParams)
  const flow = detectFlow(searchParams)

  useEffect(() => {
    if (!slug) {
      setError('Invalid payment link.')
      return
    }

    let cancelled = false

    getPublicLink(slug)
      .then((link) => {
        if (cancelled) return

        // Check if link is usable
        if (link.status !== 'ACTIVE') {
          // Still load it so ErrorScreen can show context-aware message
          loadLink(link, flow)
          setError(getStatusMessage(link.status))
          return
        }

        loadLink(link, flow)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        let message = 'Payment link not found or unavailable.'
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { status?: number } }
          if (axiosErr.response?.status === 404) {
            message = 'This payment link does not exist.'
          }
        }
        setError(message)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- slug and flow are stable from route
  }, [slug])

  if (!slug) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-md">
          <ErrorScreen message="Invalid payment link URL." />
        </div>
      </div>
    )
  }

  return (
    <PaymentCard
      state={state}
      recipientToken={recipientToken}
      onConfirm={confirm}
      onRetry={retry}
      onSwitchToGuest={switchToGuest}
      onPollingSuccess={onPollingSuccess}
      onPollingFailed={onPollingFailed}
      onPollingTimeout={onPollingTimeout}
      slug={slug}
    />
  )
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'EXPIRED':
      return 'This payment link has expired.'
    case 'PAID':
      return 'This payment has already been completed.'
    case 'CANCELLED':
      return 'This payment link has been cancelled by the merchant.'
    default:
      return 'This payment link is no longer active.'
  }
}
