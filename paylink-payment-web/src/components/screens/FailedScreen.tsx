import { XCircle } from 'lucide-react'

interface FailedScreenProps {
  reason: string
  onRetry: () => void
  onSwitchToGuest: () => void
  canSwitchToGuest: boolean
}

/**
 * Payment failed screen with retry options.
 */
export function FailedScreen({
  reason,
  onRetry,
  onSwitchToGuest,
  canSwitchToGuest,
}: FailedScreenProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-5">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <XCircle size={36} className="text-error" />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-text">Payment Failed</h2>
        <p className="text-sm text-muted max-w-xs">{reason}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRetry}
          className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Try Again
        </button>
        {canSwitchToGuest && (
          <button
            onClick={onSwitchToGuest}
            className="w-full py-3.5 border border-gray-200 text-text font-medium rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Pay with a different number
          </button>
        )}
      </div>
    </div>
  )
}
