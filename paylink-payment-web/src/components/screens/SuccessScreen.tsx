import type { PublicLink } from '../../api/payment'
import { formatMoney } from '../../utils/formatMoney'

const IOS_URL = import.meta.env.VITE_IOS_APP_URL ?? 'https://apps.apple.com/app/paylink/id000000000'
const ANDROID_URL =
  import.meta.env.VITE_ANDROID_APP_URL ??
  'https://play.google.com/store/apps/details?id=com.never9to5ive.paylink'

interface SuccessScreenProps {
  link: PublicLink
  reference?: string
  amount?: string
}

/**
 * Payment success screen with animated checkmark.
 */
export function SuccessScreen({ link, reference, amount }: SuccessScreenProps) {
  const merchantName = (link.metadata?.merchantName ?? link.metadata?.businessName ?? 'Merchant') as string
  const displayAmount = amount ?? link.amount

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      {/* Animated checkmark */}
      <div className="animate-checkmark-container">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          aria-label="Payment successful"
          role="img"
        >
          <circle
            className="animate-checkmark-circle"
            cx="40"
            cy="40"
            r="36"
            stroke="#16A34A"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            className="animate-checkmark-path"
            d="M24 40 L35 51 L56 29"
            stroke="#16A34A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="40" cy="40" r="36" fill="#16A34A" fillOpacity="0.06" />
        </svg>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-success">Payment Successful</h2>
        {displayAmount && (
          <p className="text-muted text-sm">
            {formatMoney(displayAmount, link.currency)} paid to{' '}
            <span className="font-semibold text-text">{merchantName}</span>
          </p>
        )}
      </div>

      {/* Reference */}
      {reference && (
        <div className="bg-gray-50 rounded-xl px-5 py-3 w-full text-left">
          <p className="text-xs text-muted font-medium uppercase tracking-wide">Reference</p>
          <p className="text-base font-bold text-text mt-0.5 font-mono">{reference}</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 w-full" />

      {/* App download CTA */}
      <div className="space-y-3 w-full">
        <p className="text-sm text-muted">Pay faster next time — download PayLink</p>
        <div className="flex gap-3 justify-center">
          <a
            href={IOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 max-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-accent transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            App Store
          </a>
          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 max-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-text text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M3.18 23.76c.3.17.64.22.99.14l12.48-6.84-2.86-2.86-10.61 9.56zM.54 2.02C.2 2.4 0 2.97 0 3.7v16.6c0 .73.2 1.3.54 1.68l.09.08 9.3-9.3v-.22L.63 1.94l-.09.08zM19.69 9.86l-2.78-1.52-3.19 3.19 3.19 3.2 2.81-1.54c.8-.44.8-1.16 0-1.6l-.03-.03zM3.18.24L15.66 7.1l-2.86 2.86L2.19.38l.99-.14z" />
            </svg>
            Google Play
          </a>
        </div>
      </div>
    </div>
  )
}
