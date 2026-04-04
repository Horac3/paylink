import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PaymentLink } from '../types/api.types';
import { Card } from '../components/ui/Card';
import { CreateLinkForm, CreateLinkSuccess } from '../forms/CreateLinkForm';

export function CreateLinkPage() {
  const navigate = useNavigate();
  const [createdLink, setCreatedLink] = useState<PaymentLink | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Create Payment Link</h1>
      </div>

      <Card>
        {createdLink ? (
          <CreateLinkSuccess
            link={createdLink}
            onCreateAnother={() => setCreatedLink(null)}
          />
        ) : (
          <CreateLinkForm onSuccess={setCreatedLink} />
        )}
      </Card>
    </div>
  );
}
