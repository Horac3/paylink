export function formatMoney(amount: number, currency = 'MWK'): string {
  const formatted = new Intl.NumberFormat('en-MW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formatted}`;
}
