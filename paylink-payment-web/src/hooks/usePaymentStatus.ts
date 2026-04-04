import { useEffect, useRef } from 'react'

const SSE_TIMEOUT_MS = 180_000 // 3 minutes — matches PawaPay's STK push window
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

interface UsePaymentStatusOptions {
  txnId: string | null
  onSuccess: (reference?: string) => void
  onFailed: (reason: string) => void
  onTimeout: () => void
}

/**
 * Opens an SSE connection to GET /pay/events/:txnId and waits for the server
 * to push exactly one event when the payment settles or fails.
 * Automatically closes on success, failure, timeout, or unmount.
 */
export function usePaymentStatus({
  txnId,
  onSuccess,
  onFailed,
  onTimeout,
}: UsePaymentStatusOptions): void {
  const onSuccessRef = useRef(onSuccess)
  const onFailedRef = useRef(onFailed)
  const onTimeoutRef = useRef(onTimeout)

  onSuccessRef.current = onSuccess
  onFailedRef.current = onFailed
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    if (!txnId) return

    const source = new EventSource(`${BASE_URL}/pay/events/${txnId}`)

    const timer = setTimeout(() => {
      source.close()
      onTimeoutRef.current()
    }, SSE_TIMEOUT_MS)

    source.onmessage = (e: MessageEvent<string>) => {
      clearTimeout(timer)
      source.close()

      let payload: { status: string; reference?: string } = { status: '' }
      try {
        payload = JSON.parse(e.data) as typeof payload
      } catch {
        onFailedRef.current('Unexpected response from server.')
        return
      }

      if (payload.status === 'SUCCESS') {
        onSuccessRef.current(payload.reference)
      } else {
        onFailedRef.current('Payment was declined or failed.')
      }
    }

    source.onerror = () => {
      // SSE transport error — let the timeout handle expiry.
      // The browser will auto-reconnect; close explicitly to prevent that.
      source.close()
      clearTimeout(timer)
      onTimeoutRef.current()
    }

    return () => {
      source.close()
      clearTimeout(timer)
    }
  }, [txnId])
}
