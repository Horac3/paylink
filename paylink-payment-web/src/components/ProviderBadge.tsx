import type { Provider } from '../utils/detectProvider'

interface ProviderBadgeProps {
  provider: Provider
  className?: string
}

export function ProviderBadge({ provider, className = '' }: ProviderBadgeProps) {
  if (!provider) return null

  const isAirtel = provider === 'AIRTEL'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isAirtel
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-blue-50 text-blue-700 border border-blue-200'
      } ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${isAirtel ? 'bg-red-500' : 'bg-blue-600'}`}
        aria-hidden="true"
      />
      {isAirtel ? 'Airtel Money' : 'TNM Mpamba'}
    </span>
  )
}
