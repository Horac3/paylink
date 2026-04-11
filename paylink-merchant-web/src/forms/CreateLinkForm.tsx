import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { linksApi } from '../api/links';
import type { PaymentLink, LinkType } from '../types/api.types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { CopyButton } from '../components/ui/CopyButton';
import { detectProvider } from '../utils/detectProvider';
import { SandboxPicker } from '../components/ui/SandboxPicker';

interface FormData {
  type: 'INVOICE' | 'SUBSCRIPTION' | 'DONATION' | 'REQUEST';
  amount: string;
  currency: string;
  description: string;
  expiresAt: string;
  metadata: { key: string; value: string }[];
  recurrenceInterval: string;
  recurrenceMaxCycles: string;
  hasRecipient: boolean;
  recipientPhone: string;
  recipientProvider: string;
}

interface FormErrors {
  amount?: string;
}

const LINK_TYPES: { value: LinkType; label: string; description: string }[] = [
  { value: 'INVOICE', label: 'Invoice', description: 'One-time payment for a specific amount' },
  { value: 'SUBSCRIPTION', label: 'Subscription', description: 'Recurring payment on a schedule' },
  { value: 'DONATION', label: 'Donation', description: 'Accept donations of any amount' },
  { value: 'REQUEST', label: 'Request', description: 'Request payment from a specific person' },
];

interface Props {
  onSuccess: (link: PaymentLink) => void;
}

export function CreateLinkForm({ onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const TOTAL_STEPS = 5;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
  } = useForm<FormData>({
    defaultValues: {
      type: 'INVOICE',
      currency: 'MWK',
      amount: '',
      description: '',
      expiresAt: '',
      metadata: [],
      recurrenceInterval: '',
      recurrenceMaxCycles: '',
      hasRecipient: false,
      recipientPhone: '',
      recipientProvider: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'metadata' });

  const watchedType = watch('type');
  const watchedHasRecipient = watch('hasRecipient');
  const watchedPhone = watch('recipientPhone') ?? '';
  const detectedProvider = detectProvider(watchedPhone);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const metaObj: Record<string, string> = {};
      data.metadata.forEach(({ key, value }) => {
        if (key) metaObj[key] = value;
      });
      return linksApi.create({
        type: data.type,
        amount: data.amount || undefined,
        currency: data.currency,
        description: data.description || undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
        metadata: Object.keys(metaObj).length > 0 ? metaObj : undefined,
        recurrenceInterval:
          data.type === 'SUBSCRIPTION' ? data.recurrenceInterval || undefined : undefined,
        recurrenceMaxCycles:
          data.type === 'SUBSCRIPTION' && data.recurrenceMaxCycles
            ? parseInt(data.recurrenceMaxCycles, 10)
            : undefined,
        recipientMsisdn: data.hasRecipient ? data.recipientPhone || undefined : undefined,
        providerCode: data.hasRecipient ? data.recipientProvider || undefined : undefined,
      });
    },
    onSuccess: (link) => {
      toast.success('Payment link created!');
      onSuccess(link);
    },
    onError: () => {
      toast.error('Failed to create payment link');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const amountNum = parseFloat(data.amount);
    if (!data.amount || isNaN(amountNum) || amountNum <= 0) {
      setFormErrors({ amount: 'Amount must be a positive number' });
      setStep(2);
      return;
    }
    setFormErrors({});
    mutation.mutate(data);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const watchedData = watch();

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                i + 1 < step
                  ? 'bg-primary text-white'
                  : i + 1 === step
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-gray-200 text-text-secondary'
              }`}
            >
              {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className={`h-0.5 w-8 ${i + 1 < step ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
        <span className="ml-2 text-sm text-text-secondary">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Type */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text-primary">Select Link Type</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {LINK_TYPES.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('type', value)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    watchedType === value
                      ? 'border-primary bg-primary-light'
                      : 'border-border hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-text-primary">{label}</p>
                  <p className="text-sm text-text-secondary mt-1">{description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text-primary">Link Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                error={formErrors.amount}
                {...register('amount')}
              />
              <Input label="Currency" value="MWK" readOnly className="bg-gray-50" />
            </div>
            <Input
              label="Description (optional)"
              placeholder="Payment for services..."
              {...register('description')}
            />
            <Input
              label="Expiry Date (optional)"
              type="datetime-local"
              {...register('expiresAt')}
            />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-primary">
                  Metadata (optional)
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append({ key: '', value: '' })}
                >
                  <Plus size={14} /> Add field
                </Button>
              </div>
              {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <Input placeholder="Key" {...register(`metadata.${idx}.key`)} className="flex-1" />
                  <Input placeholder="Value" {...register(`metadata.${idx}.value`)} className="flex-1" />
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-text-secondary hover:text-status-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Recurrence */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text-primary">Recurrence Settings</h2>
            {watchedType !== 'SUBSCRIPTION' ? (
              <p className="text-sm text-text-secondary rounded-lg bg-gray-50 p-4">
                Recurrence is only available for Subscription links. Your current type is{' '}
                <strong>{watchedType}</strong>.
              </p>
            ) : (
              <>
                <Select
                  label="Recurrence Interval"
                  options={[
                    { value: '', label: 'Select interval' },
                    { value: 'DAILY', label: 'Daily' },
                    { value: 'WEEKLY', label: 'Weekly' },
                    { value: 'MONTHLY', label: 'Monthly' },
                    { value: 'YEARLY', label: 'Yearly' },
                  ]}
                  {...register('recurrenceInterval')}
                />
                <Input
                  label="Max Cycles (optional)"
                  type="number"
                  min="1"
                  placeholder="Leave blank for unlimited"
                  {...register('recurrenceMaxCycles')}
                />
              </>
            )}
          </div>
        )}

        {/* Step 4: Recipient */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text-primary">Recipient (optional)</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                {...register('hasRecipient')}
              />
              <span className="text-sm text-text-primary">Add a specific recipient phone number</span>
            </label>
            {watchedHasRecipient && (
              <>
                <SandboxPicker
                  onSelect={(n) => {
                    setValue('recipientPhone', `+${n.msisdn}`);
                    setValue('recipientProvider', n.providerCode);
                  }}
                />
                <Input
                  label="Phone Number"
                  placeholder="+265 88 XXX XXXX"
                  hint="Include country code, e.g. +265"
                  {...register('recipientPhone')}
                />
                {watchedPhone && (
                  <p className="text-sm text-text-secondary">
                    Detected provider:{' '}
                    <strong className="text-text-primary">{detectedProvider}</strong>
                  </p>
                )}
                <Select
                  label="Provider (optional)"
                  options={[
                    { value: '', label: `Auto-detect (${detectedProvider})` },
                    { value: 'AIRTEL_MWI', label: 'Airtel Money' },
                    { value: 'TNM_MWI', label: 'TNM Mpamba' },
                  ]}
                  {...register('recipientProvider')}
                />
              </>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text-primary">Review &amp; Create</h2>
            <div className="rounded-xl border border-border divide-y divide-border">
              {[
                { label: 'Type', value: watchedData.type },
                { label: 'Amount', value: `MWK ${watchedData.amount || '0'}` },
                { label: 'Currency', value: watchedData.currency || 'MWK' },
                { label: 'Description', value: watchedData.description || '—' },
                { label: 'Expires', value: watchedData.expiresAt || '—' },
                ...(watchedData.type === 'SUBSCRIPTION'
                  ? [
                      { label: 'Interval', value: watchedData.recurrenceInterval || '—' },
                      {
                        label: 'Max Cycles',
                        value: watchedData.recurrenceMaxCycles || '—',
                      },
                    ]
                  : []),
                ...(watchedData.hasRecipient
                  ? [{ label: 'Recipient', value: watchedData.recipientPhone || '—' }]
                  : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between px-4 py-3">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-sm font-medium text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < TOTAL_STEPS ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" loading={mutation.isPending}>
              Create Link
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

interface SuccessViewProps {
  link: PaymentLink;
  onCreateAnother: () => void;
}

export function CreateLinkSuccess({ link, onCreateAnother }: SuccessViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center py-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={28} className="text-status-success" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Link Created!</h2>
        <p className="text-sm text-text-secondary mt-1">Your payment link is ready to share.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-1">Standard URL</p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-sm font-mono text-text-primary">
              {link.url}
            </span>
            <CopyButton text={link.url} />
          </div>
        </div>
        {link.prefilledUrl && (
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">Pre-filled URL</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2">
              <span className="flex-1 truncate text-sm font-mono text-text-primary">
                {link.prefilledUrl}
              </span>
              <CopyButton text={link.prefilledUrl} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={onCreateAnother}>
          Create Another Link
        </Button>
      </div>
    </div>
  );
}
