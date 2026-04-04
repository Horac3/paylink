import { formatMoney } from '../../utils/formatMoney';

interface MoneyTextProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function MoneyText({ amount, currency = 'MWK', className = '' }: MoneyTextProps) {
  return <span className={className}>{formatMoney(amount, currency)}</span>;
}
