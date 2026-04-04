/**
 * Formats a monetary value with currency prefix.
 * Example: formatMoney("5000", "MWK") → "MWK 5,000.00"
 */
export function formatMoney(amount: string | number | null, currency = 'MWK'): string {
  if (amount === null || amount === undefined) return `${currency} —`
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return `${currency} —`
  return `${currency} ${num.toLocaleString('en-MW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Formats seconds into M:SS display string.
 */
export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}
