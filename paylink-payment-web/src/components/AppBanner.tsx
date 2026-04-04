import { Smartphone } from 'lucide-react'
import type { FlowType } from '../utils/detectFlow'

const IOS_URL = import.meta.env.VITE_IOS_APP_URL ?? 'https://apps.apple.com/app/paylink/id000000000'
const ANDROID_URL =
  import.meta.env.VITE_ANDROID_APP_URL ??
  'https://play.google.com/store/apps/details?id=com.never9to5ive.paylink'

function detectOS(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'other'
}

interface AppBannerProps {
  flow: FlowType
}

export function AppBanner({ flow }: AppBannerProps) {
  const os = detectOS()
  const message =
    flow === 'GUEST'
      ? 'No number entry every time — get the app'
      : 'Pay even faster next time — get the app'

  const primaryHref = os === 'ios' ? IOS_URL : ANDROID_URL
  const secondaryHref = os === 'ios' ? ANDROID_URL : IOS_URL
  const primaryLabel = os === 'ios' ? 'App Store' : 'Google Play'
  const secondaryLabel = os === 'ios' ? 'Google Play' : 'App Store'

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Smartphone size={16} className="text-white" />
          </div>
          <p className="text-xs text-muted truncate">{message}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-accent transition-colors"
          >
            {primaryLabel}
          </a>
          {os === 'other' && (
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
