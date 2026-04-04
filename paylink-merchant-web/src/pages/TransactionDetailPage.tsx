import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { transactionsApi } from '../api/transactions';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MoneyText } from '../components/ui/MoneyText';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { RefundForm } from '../forms/RefundForm';
import { formatDate } from '../utils/formatDate';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refundOpen, setRefundOpen] = useState(false);

  const { data: txn, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Spinner size="lg" className="py-20" />;
  if (!txn) return <div className="py-20 text-center text-text-secondary">Transaction not found</div>;

  const canRefund = txn.status === 'SUCCESS';

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Transaction Detail</h1>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-text-secondary">{txn.id}</span>
          <Badge status={txn.status} type="transaction" />
        </div>

        <DetailRow label="Date" value={formatDate(txn.createdAt)} />
        <DetailRow label="Rail" value={txn.rail} />
        {txn.providerCode && <DetailRow label="Provider Code" value={txn.providerCode} />}
        {txn.phone && <DetailRow label="Phone" value={txn.phone} />}
        <DetailRow
          label="Gross Amount"
          value={<MoneyText amount={txn.grossAmount} currency={txn.currency} />}
        />
        <DetailRow
          label="Fee Amount"
          value={<MoneyText amount={txn.feeAmount} currency={txn.currency} />}
        />
        <DetailRow
          label="Net Amount"
          value={
            <MoneyText
              amount={txn.netAmount}
              currency={txn.currency}
              className="font-semibold text-status-success"
            />
          }
        />
        <DetailRow label="Currency" value={txn.currency} />
        <DetailRow label="Updated" value={formatDate(txn.updatedAt)} />
      </Card>

      {canRefund && (
        <div className="flex justify-end">
          <Button variant="danger" onClick={() => setRefundOpen(true)}>
            Request Refund
          </Button>
        </div>
      )}

      <Modal open={refundOpen} onClose={() => setRefundOpen(false)} title="Request Refund">
        <RefundForm
          transactionId={txn.id}
          maxAmount={txn.grossAmount}
          onClose={() => setRefundOpen(false)}
        />
      </Modal>
    </div>
  );
}
