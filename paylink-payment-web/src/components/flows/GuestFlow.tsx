import { useState, useId } from 'react'
import { Phone } from 'lucide-react'
import { detectProvider, providerCode } from '../../utils/detectProvider'
import type { Provider } from '../../utils/detectProvider'
import { ProviderBadge } from '../ProviderBadge'
import { formatMoney } from '../../utils/formatMoney'
import { SandboxPicker } from '../SandboxPicker'
import { lookupSandboxDeposit } from '../../constants/sandboxNumbers'

type ProviderSelection = 'AUTO' | 'AIRTEL' | 'TNM'

interface GuestFlowProps {
  currency: string
  isDonation: boolean
  onConfirm: (msisdn: string, provider: string | undefined, amount?: string, sandboxHint?: string) => void
  isLoading: boolean
}

/**
 * Guest flow: user enters their own phone number + optional provider override.
 * DONATION links also show an amount input.
 */
export function GuestFlow({ currency, isDonation, onConfirm, isLoading }: GuestFlowProps) {
  const [phone, setPhone] = useState('')
  const [providerSel, setProviderSel] = useState<ProviderSelection>('AUTO')
  const [donationAmount, setDonationAmount] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [amountError, setAmountError] = useState('')
  const phoneId = useId()
  const amountId = useId()

  const detectedProvider: Provider = providerSel === 'AUTO' ? detectProvider(phone) : providerSel

  const fullMsisdn = `265${phone.replace(/^0/, '').replace(/\D/g, '')}`
  const sandboxMatch = import.meta.env.DEV ? lookupSandboxDeposit(fullMsisdn) : undefined

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9)
    setPhone(raw)
    setPhoneError('')
  }

  function handleSubmit() {
    let valid = true

    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8 || digits.length > 9) {
      setPhoneError('Enter a valid Malawi mobile number (e.g. 88 123 4567)')
      valid = false
    }

    if (isDonation) {
      const num = parseFloat(donationAmount)
      if (!donationAmount || isNaN(num) || num <= 0) {
        setAmountError('Enter a valid amount greater than 0')
        valid = false
      }
    }

    if (!valid) return

    const resolvedCode = providerCode(detectedProvider)
    const hint = sandboxMatch
      ? `${sandboxMatch.expectedStatus}${sandboxMatch.failureCode ? ` · ${sandboxMatch.failureCode}` : ''}`
      : undefined
    onConfirm(fullMsisdn, resolvedCode, isDonation ? donationAmount : undefined, hint)
  }

  const providerBtns: ProviderSelection[] = ['AUTO', 'AIRTEL', 'TNM']

  return (
    <div className="space-y-4">
      {/* Donation amount input */}
      {isDonation && (
        <div>
          <label htmlFor={amountId} className="block text-sm font-medium text-text mb-1.5">
            Amount ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-medium text-sm">
              {currency}
            </span>
            <input
              id={amountId}
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={donationAmount}
              onChange={(e) => {
                setDonationAmount(e.target.value)
                setAmountError('')
              }}
              className={`w-full pl-14 pr-4 py-3 border rounded-xl text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                amountError ? 'border-error focus:ring-error' : 'border-gray-200'
              }`}
            />
          </div>
          {amountError && <p className="mt-1 text-xs text-error">{amountError}</p>}
          {donationAmount && !amountError && (
            <p className="mt-1 text-xs text-muted">
              {formatMoney(donationAmount, currency)}
            </p>
          )}
        </div>
      )}

      {/* Phone input */}
      <div>
        <label htmlFor={phoneId} className="block text-sm font-medium text-text mb-1.5">
          Your mobile number
        </label>
        <div
          className={`flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent transition-all ${
            phoneError ? 'border-error focus-within:ring-error' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            <Phone size={14} className="text-muted" />
            <span className="text-sm font-medium text-text">+265</span>
          </div>
          <input
            id={phoneId}
            type="tel"
            inputMode="numeric"
            placeholder="88 123 4567"
            value={phone}
            onChange={handlePhoneChange}
            className="flex-1 px-3 py-3 text-sm text-text bg-white focus:outline-none placeholder:text-gray-300"
          />
          {detectedProvider && (
            <div className="pr-2">
              <ProviderBadge provider={detectedProvider} />
            </div>
          )}
        </div>
        {phoneError && <p className="mt-1 text-xs text-error">{phoneError}</p>}
        {sandboxMatch && (
          <p className={`mt-1 text-xs font-medium ${
            sandboxMatch.expectedStatus === 'COMPLETED' ? 'text-green-600' :
            sandboxMatch.expectedStatus === 'SUBMITTED' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            Sandbox: expected {sandboxMatch.expectedStatus}
            {sandboxMatch.failureCode ? ` · ${sandboxMatch.failureCode}` : ''}
          </p>
        )}
      </div>

      {/* Provider selector */}
      <div>
        <p className="text-xs font-medium text-muted mb-2">Provider</p>
        <div className="flex gap-2">
          {providerBtns.map((p) => (
            <button
              key={p}
              onClick={() => setProviderSel(p)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
                providerSel === p
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-muted border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p === 'AUTO' ? 'Auto' : p === 'AIRTEL' ? 'Airtel' : 'TNM'}
            </button>
          ))}
        </div>
      </div>

      {/* Sandbox test number picker (dev only) */}
      <SandboxPicker
        onSelect={(n) => {
          const local = n.localDigits.replace(/^0/, '')
          setPhone(local)
          setPhoneError('')
          setProviderSel('AUTO')
        }}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        {isLoading ? 'Processing…' : 'Confirm & Pay'}
      </button>
    </div>
  )
}
