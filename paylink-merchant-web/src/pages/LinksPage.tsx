import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Link2 } from 'lucide-react';
import { linksApi } from '../api/links';
import type { LinkStatus } from '../types/api.types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MoneyText } from '../components/ui/MoneyText';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Table, Th, Td } from '../components/ui/Table';
import { formatDate } from '../utils/formatDate';

const tabs: { label: string; value: LinkStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export function LinksPage() {
  const [activeTab, setActiveTab] = useState<LinkStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['links', activeTab, page],
    queryFn: () =>
      linksApi.list({
        page,
        limit: 10,
        status: activeTab === 'ALL' ? undefined : activeTab,
      }),
  });

  const handleTabChange = (tab: LinkStatus | 'ALL') => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Payment Links</h1>
        <Link to="/links/create">
          <Button>
            <Plus size={16} />
            Create Link
          </Button>
        </Link>
      </div>

      <Card padding={false}>
        <div className="flex gap-1 border-b border-border px-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 text-sm font-medium transition rounded-t-lg -mb-px ${
                activeTab === tab.value
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Spinner className="py-16" />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={<Link2 size={40} />}
            title="No payment links"
            description="Create your first payment link to get started"
            action={
              <Link to="/links/create">
                <Button>
                  <Plus size={16} /> Create Link
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Slug</Th>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Expires</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <Td>
                      <span className="font-mono text-xs text-text-secondary">{link.slug}</span>
                    </Td>
                    <Td>
                      <span className="text-xs font-medium">{link.type}</span>
                    </Td>
                    <Td>
                      <MoneyText amount={link.amount} currency={link.currency} className="font-medium" />
                    </Td>
                    <Td>
                      <Badge status={link.status} type="link" />
                    </Td>
                    <Td className="text-text-secondary">
                      {link.expiresAt ? formatDate(link.expiresAt) : '—'}
                    </Td>
                    <Td>
                      <Link to={`/links/${link.id}`} className="text-sm text-primary hover:underline">
                        View
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              page={page}
              totalPages={data?.meta.totalPages ?? 1}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
