import { ShieldCheck } from 'lucide-react'
import { ProviderBadge } from '../ProviderBadge'
import type { Provider } from '../../utils/detectProvider'

interface RecipientFlowProps {
  maskedNumber: string
  provider: Provider
  onConfirm: () => void
  onSwitchToGuest: () => void
  isLoading: boolean
}

/**
 * Shows a pre-filled masked phone number from the recipient token.
 * Renders "Confirm & Pay" and a "Not you?" escape hatch.
 */
export function RecipientFlow({
  maskedNumber,
  provider,
  onConfirm,
  onSwitchToGuest,
  isLoading,
}: RecipientFlowProps) {
  return (
    <div className="space-y-4">
      {/* Prepared-for info */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              {provider === 'AIRTEL' ? 'Airtel Money' : provider === 'TNM' ? 'TNM Mpamba' : 'Mobile Money'}{' '}
              <span className="font-normal text-muted">****{maskedNumber}</span>
            </p>
            <p className="text-xs text-muted mt-0.5">This payment is prepared for you</p>
          </div>
          {provider && (
            <div className="ml-auto">
              <ProviderBadge provider={provider} />
            </div>
          )}
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        {isLoading ? 'Processing…' : 'Confirm & Pay'}
      </button>

      {/* Escape hatch */}
      <p className="text-center text-sm text-muted">
        Not you?{' '}
        <button
          onClick={onSwitchToGuest}
          className="text-accent font-medium hover:underline focus:outline-none"
        >
          Pay with a different number
        </button>
      </p>
    </div>
  )
}
