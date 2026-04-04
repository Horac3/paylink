import type { LinkStatus, TransactionStatus } from '../../types/api.types';

const linkStatusStyles: Record<LinkStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-600',
  PAID: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
  CANCELLED: 'bg-red-100 text-red-600',
};

const txnStatusStyles: Record<TransactionStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-600',
  SUCCESS: 'bg-green-100 text-green-600',
  FAILED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-purple-100 text-purple-600',
};

interface BadgeProps {
  status: LinkStatus | TransactionStatus;
  type?: 'link' | 'transaction';
}

export function Badge({ status, type = 'transaction' }: BadgeProps) {
  const styles =
    type === 'link'
      ? linkStatusStyles[status as LinkStatus]
      : txnStatusStyles[status as TransactionStatus];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}
