import { CreditCard } from 'lucide-react'
import type { PublicLink } from '../../api/payment'
import type { FlowType } from '../../utils/detectFlow'
import { formatMoney } from '../../utils/formatMoney'
import { RecipientFlow } from '../flows/RecipientFlow'
import { GuestFlow } from '../flows/GuestFlow'
import type { Provider } from '../../utils/detectProvider'

const LINK_TYPE_LABELS: Record<PublicLink['type'], string> = {
  INVOICE: 'Invoice',
  SUBSCRIPTION: 'Subscription',
  DONATION: 'Donation',
  REQUEST: 'Payment Request',
}

interface ReadyScreenProps {
  link: PublicLink
  flow: FlowType
  recipientToken: string | null
  maskedNumber: string
  recipientProvider: Provider
  isConfirming: boolean
  onConfirmRecipient: () => void
  onConfirmGuest: (msisdn: string, provider: string | undefined, amount?: string) => void
  onSwitchToGuest: () => void
}

/**
 * The main "ready to pay" screen.
 * Shows merchant info, amount, and the appropriate flow UI.
 */
export function ReadyScreen({
  link,
  flow,
  maskedNumber,
  recipientProvider,
  isConfirming,
  onConfirmRecipient,
  onConfirmGuest,
  onSwitchToGuest,
}: ReadyScreenProps) {
  const merchantName = (link.metadata?.merchantName ?? link.metadata?.businessName ?? 'Merchant') as string
  const isDonation = link.type === 'DONATION'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-muted uppercase tracking-wide">Pay</p>
        <h1 className="text-2xl font-bold text-text">{merchantName}</h1>
        {!isDonation && link.amount && (
          <p className="text-3xl font-bold text-primary mt-1">
            {formatMoney(link.amount, link.currency)}
          </p>
        )}
        {isDonation && !link.amount && (
          <p className="text-base text-muted mt-1">Enter your donation amount below</p>
        )}
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <CreditCard size={12} />
            {LINK_TYPE_LABELS[link.type]}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Flow UI */}
      {flow === 'RECIPIENT' ? (
        <RecipientFlow
          maskedNumber={maskedNumber}
          provider={recipientProvider}
          onConfirm={onConfirmRecipient}
          onSwitchToGuest={onSwitchToGuest}
          isLoading={isConfirming}
        />
      ) : (
        <GuestFlow
          currency={link.currency}
          isDonation={isDonation}
          onConfirm={onConfirmGuest}
          isLoading={isConfirming}
        />
      )}
    </div>
  )
}
