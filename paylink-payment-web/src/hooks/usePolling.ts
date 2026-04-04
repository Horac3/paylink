import { useEffect, useRef } from 'react'
import { getStatus } from '../api/payment'

const POLL_INTERVAL_MS = 3_000
const TIMEOUT_MS = 180_000 // 3 minutes

interface UsePollingOptions {
  txnId: string | null
  onSuccess: (externalRef?: string) => void
  onFailed: (reason: string) => void
  onTimeout: () => void
}

/**
 * Polls GET /api/v1/pay/status/:txnId every 3 seconds.
 * Stops when status is SUCCESS or FAILED.
 * Auto-stops after 180 seconds → calls onTimeout.
 * Cleans up interval on unmount.
 */
export function usePolling({ txnId, onSuccess, onFailed, onTimeout }: UsePollingOptions): void {
  const onSuccessRef = useRef(onSuccess)
  const onFailedRef = useRef(onFailed)
  const onTimeoutRef = useRef(onTimeout)

  // Keep refs current without causing re-runs
  onSuccessRef.current = onSuccess
  onFailedRef.current = onFailed
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    if (!txnId) return

    const startedAt = Date.now()
    let stopped = false

    const intervalId = setInterval(async () => {
      if (stopped) return

      // Check timeout
      if (Date.now() - startedAt >= TIMEOUT_MS) {
        stopped = true
        clearInterval(intervalId)
        onTimeoutRef.current()
        return
      }

      try {
        const result = await getStatus(txnId)
        if (stopped) return

        if (result.status === 'SUCCESS') {
          stopped = true
          clearInterval(intervalId)
          onSuccessRef.current(result.externalRef)
        } else if (result.status === 'FAILED') {
          stopped = true
          clearInterval(intervalId)
          onFailedRef.current('Payment was declined or failed.')
        }
      } catch {
        // Network errors during polling are swallowed — we keep retrying
      }
    }, POLL_INTERVAL_MS)

    return () => {
      stopped = true
      clearInterval(intervalId)
    }
  }, [txnId])
}
