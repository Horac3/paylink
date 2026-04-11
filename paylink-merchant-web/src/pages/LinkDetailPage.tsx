import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { linksApi } from '../api/links';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MoneyText } from '../components/ui/MoneyText';
import { Button } from '../components/ui/Button';
import { CopyButton } from '../components/ui/CopyButton';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { formatDate } from '../utils/formatDate';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

export function LinkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: link, isLoading } = useQuery({
    queryKey: ['link', id],
    queryFn: () => linksApi.getById(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => linksApi.cancel(id!),
    onSuccess: () => {
      toast.success('Link cancelled');
      void queryClient.invalidateQueries({ queryKey: ['link', id] });
      void queryClient.invalidateQueries({ queryKey: ['links'] });
      setCancelOpen(false);
    },
    onError: () => {
      toast.error('Failed to cancel link');
    },
  });

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (!link) {
    return (
      <div className="py-20 text-center text-text-secondary">Link not found</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Link Detail</h1>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-sm text-text-secondary">{link.slug}</span>
          <Badge status={link.status} type="link" />
        </div>

        <DetailRow label="Type" value={link.type} />
        <DetailRow
          label="Amount"
          value={<MoneyText amount={link.amount} currency={link.currency} />}
        />
        <DetailRow label="Currency" value={link.currency} />
        {link.description && <DetailRow label="Description" value={link.description} />}
        <DetailRow label="Created" value={formatDate(link.createdAt)} />
        {link.expiresAt && <DetailRow label="Expires" value={formatDate(link.expiresAt)} />}
        {link.recipientPhone && <DetailRow label="Recipient Phone" value={link.recipientPhone} />}
        {link.recipientProvider && <DetailRow label="Provider" value={link.recipientProvider} />}
        {link.recurrenceInterval && (
          <DetailRow label="Recurrence" value={link.recurrenceInterval} />
        )}
        {link.recurrenceMaxCycles && (
          <DetailRow label="Max Cycles" value={String(link.recurrenceMaxCycles)} />
        )}
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-text-primary mb-4">URLs</h2>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-text-secondary mb-1">Standard URL</p>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-border px-3 py-2">
              <span className="flex-1 truncate text-sm font-mono text-text-primary">
                {link.url}
              </span>
              <CopyButton text={link.url} />
              <a href={link.url} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          {link.prefilledUrl && (
            <div>
              <p className="text-xs text-text-secondary mb-1">Pre-filled URL</p>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-border px-3 py-2">
                <span className="flex-1 truncate text-sm font-mono text-text-primary">
                  {link.prefilledUrl}
                </span>
                <CopyButton text={link.prefilledUrl} />
                <a href={link.prefilledUrl} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </div>
      </Card>

      {link.metadata && Object.keys(link.metadata).length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Metadata</h2>
          {Object.entries(link.metadata).map(([k, v]) => (
            <DetailRow key={k} label={k} value={String(v)} />
          ))}
        </Card>
      )}

      {link.status === 'ACTIVE' && (
        <div className="flex justify-end">
          <Button variant="danger" onClick={() => setCancelOpen(true)}>
            Cancel Link
          </Button>
        </div>
      )}

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel Payment Link"
      >
        <p className="text-sm text-text-secondary mb-6">
          Are you sure you want to cancel this payment link? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCancelOpen(false)}>
            Keep Link
          </Button>
          <Button
            variant="danger"
            loading={cancelMutation.isPending}
            onClick={() => cancelMutation.mutate()}
          >
            Cancel Link
          </Button>
        </div>
      </Modal>
    </div>
  );
}
