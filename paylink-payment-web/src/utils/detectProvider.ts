/**
 * Detects the mobile money provider from a Malawi MSISDN prefix.
 * Malawi prefix rules (after stripping +265 or leading 0):
 *   - Airtel: 99x, 98x, 97x, 31x, 32x
 *   - TNM:    88x, 89x, 21x
 */
export type Provider = 'AIRTEL' | 'TNM' | null

/**
 * Given a raw phone number string (digits only, may include +265 or 0 prefix),
 * return the detected provider or null.
 */
export function detectProvider(msisdn: string): Provider {
  // Strip non-digits
  const digits = msisdn.replace(/\D/g, '')

  // Normalize to local format (8-digit number starting with 2 digits of interest)
  let local = digits
  if (local.startsWith('265')) {
    local = local.slice(3)
  } else if (local.startsWith('0')) {
    local = local.slice(1)
  }

  if (local.length < 2) return null

  const prefix2 = local.slice(0, 2)
  const prefix3 = local.slice(0, 3)

  // Airtel prefixes
  if (['99', '98', '97'].includes(prefix2)) return 'AIRTEL'
  if (['31', '32'].includes(prefix2)) return 'AIRTEL'
  if (prefix3 === '310' || prefix3 === '320') return 'AIRTEL'

  // TNM prefixes
  if (['88', '89'].includes(prefix2)) return 'TNM'
  if (prefix2 === '21') return 'TNM'

  return null
}

export function providerCode(provider: Provider): string | undefined {
  if (provider === 'AIRTEL') return 'AIRTEL_MWI'
  if (provider === 'TNM') return 'TNM_MWI'
  return undefined
}
