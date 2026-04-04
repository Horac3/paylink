import { useEffect, useState } from 'react'
import { Smartphone } from 'lucide-react'
import type { PublicLink } from '../../api/payment'
import { formatMoney, formatCountdown } from '../../utils/formatMoney'

interface PollingScreenProps {
  link: PublicLink
  expiresAt: number
  onCancel: () => void
}

/**
 * "Check your phone" screen shown while polling for payment confirmation.
 * Shows a CSS-animated phone icon, countdown timer, and cancel button.
 */
export function PollingScreen({ link, expiresAt, onCancel }: PollingScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.round((expiresAt - Date.now()) / 1000)),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  const merchantName = (link.metadata?.merchantName ?? link.metadata?.businessName ?? 'Merchant') as string
  const providerName = 'Mobile Money'

  return (
    <div className="flex flex-col items-center text-center space-y-5">
      {/* Animated phone icon */}
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
        <div
          className="absolute w-24 h-24 rounded-full bg-accent/10 animate-pulse-ring"
          aria-hidden="true"
        />
        <div className="relative w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-phone-vibrate">
          <Smartphone size={32} className="text-primary" />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-text">Check your phone</h2>
        <p className="text-sm text-muted max-w-xs">
          Approve the payment prompt on your {providerName} handset
        </p>
        <p className="text-sm font-semibold text-text">
          {merchantName}
          {link.amount ? ` · ${formatMoney(link.amount, link.currency)}` : ''}
        </p>
      </div>

      {/* Spinner + waiting label */}
      <div className="flex items-center gap-2 text-muted text-sm">
        <svg
          className="w-4 h-4 animate-spin-smooth text-accent"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span>Waiting…</span>
      </div>

      {/* Countdown */}
      <div className="bg-gray-50 rounded-xl px-5 py-3 text-center">
        <p className="text-xs text-muted">This prompt expires in</p>
        <p
          className={`text-2xl font-bold tabular-nums mt-0.5 ${
            secondsLeft <= 30 ? 'text-error' : 'text-text'
          }`}
        >
          {formatCountdown(secondsLeft)}
        </p>
      </div>

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="text-sm text-muted hover:text-error underline underline-offset-2 transition-colors focus:outline-none"
      >
        Cancel payment
      </button>
    </div>
  )
}
