import { AlertTriangle } from 'lucide-react'
import type { PublicLink } from '../../api/payment'

const STATUS_MESSAGES: Partial<Record<PublicLink['status'], string>> = {
  EXPIRED: 'This payment link has expired.',
  PAID: 'This payment has already been completed.',
  CANCELLED: 'This payment link has been cancelled.',
  PARTIALLY_PAID: 'This link is partially paid and no longer accepts new payments.',
}

interface ErrorScreenProps {
  message?: string
  linkStatus?: PublicLink['status']
}

/**
 * Shown when the link is not found, expired, paid, or cancelled.
 */
export function ErrorScreen({ message, linkStatus }: ErrorScreenProps) {
  const displayMessage =
    message ??
    (linkStatus ? STATUS_MESSAGES[linkStatus] : undefined) ??
    'This link is no longer active.'

  return (
    <div className="flex flex-col items-center text-center space-y-5">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
        <AlertTriangle size={32} className="text-amber-500" />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-text">This link is no longer active</h2>
        <p className="text-sm text-muted max-w-xs">{displayMessage}</p>
      </div>

      {/* Suggestion */}
      <p className="text-xs text-muted">
        If you believe this is an error, please contact the person who shared this link.
      </p>
    </div>
  )
}
