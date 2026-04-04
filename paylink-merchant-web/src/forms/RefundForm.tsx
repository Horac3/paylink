import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { refundsApi } from '../api/refunds';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface FormData {
  amount: string;
  reason: string;
}

interface RefundFormProps {
  transactionId: string;
  maxAmount: number;
  onClose: () => void;
}

export function RefundForm({ transactionId, maxAmount, onClose }: RefundFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { amount: String(maxAmount), reason: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      refundsApi.initiate({
        transactionId,
        amount: parseFloat(data.amount),
        reason: data.reason,
      }),
    onSuccess: () => {
      toast.success('Refund initiated successfully');
      void queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to initiate refund');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Refund Amount (MWK)"
        type="number"
        step="0.01"
        min="0.01"
        max={maxAmount}
        error={errors.amount?.message}
        {...register('amount', {
          required: 'Amount is required',
          validate: (v) => {
            const n = parseFloat(v);
            if (isNaN(n) || n <= 0) return 'Amount must be positive';
            if (n > maxAmount) return `Cannot exceed MWK ${maxAmount.toLocaleString()}`;
            return true;
          },
        })}
      />
      <Input
        label="Reason"
        placeholder="Reason for refund..."
        error={errors.reason?.message}
        {...register('reason', { required: 'Reason is required', minLength: { value: 3, message: 'Reason is too short' } })}
      />
      <p className="text-xs text-text-secondary">
        Maximum refundable amount: MWK {maxAmount.toLocaleString()}
      </p>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="danger" loading={mutation.isPending}>
          Request Refund
        </Button>
      </div>
    </form>
  );
}
