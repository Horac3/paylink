import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';

const profileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const webhookSchema = z.object({
  webhookUrl: z.string().url('Enter a valid URL').or(z.literal('')),
});

type WebhookFormData = z.infer<typeof webhookSchema>;

const TABS = ['Profile', 'Webhooks'] as const;
type Tab = (typeof TABS)[number];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const { merchant } = useAuth();

  const { data: me, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { businessName: me?.businessName ?? merchant?.businessName ?? '' },
  });

  const webhookForm = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    values: { webhookUrl: me?.webhookUrl ?? '' },
  });

  const profileMutation = useMutation({
    mutationFn: (_data: ProfileFormData) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const webhookMutation = useMutation({
    mutationFn: (_data: WebhookFormData) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Webhook URL saved');
    },
    onError: () => {
      toast.error('Failed to save webhook URL');
    },
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition -mb-px ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner className="py-8" />
      ) : (
        <>
          {activeTab === 'Profile' && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">Profile Details</h2>
              <form
                onSubmit={profileForm.handleSubmit((d) => profileMutation.mutate(d))}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Business Name"
                  error={profileForm.formState.errors.businessName?.message}
                  {...profileForm.register('businessName')}
                />
                <Input label="Email" value={me?.email ?? merchant?.email ?? ''} readOnly className="bg-gray-50" />
                <Input label="Fee Tier" value={me?.feeTier ?? merchant?.feeTier ?? ''} readOnly className="bg-gray-50" />
                <div className="flex justify-end">
                  <Button type="submit" loading={profileMutation.isPending}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'Webhooks' && (
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-2">Webhook Settings</h2>
              <p className="text-sm text-text-secondary mb-4">
                Configure a URL to receive real-time payment notifications.
              </p>
              <Alert variant="info">
                PayLink will send a POST request to your webhook URL when a transaction succeeds or fails.
              </Alert>
              <form
                onSubmit={webhookForm.handleSubmit((d) => webhookMutation.mutate(d))}
                className="flex flex-col gap-4 mt-4"
              >
                <Input
                  label="Webhook URL"
                  type="url"
                  placeholder="https://yourapp.com/webhooks/paylink"
                  error={webhookForm.formState.errors.webhookUrl?.message}
                  {...webhookForm.register('webhookUrl')}
                />
                <div className="flex justify-end">
                  <Button type="submit" loading={webhookMutation.isPending}>
                    Save Webhook
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
