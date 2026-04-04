import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, Link2, RefreshCw, DollarSign, Plus, ArrowRight } from 'lucide-react';
import { analyticsApi } from '../api/analytics';
import { transactionsApi } from '../api/transactions';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { MoneyText } from '../components/ui/MoneyText';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/formatDate';

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', 'merchant'],
    queryFn: () => analyticsApi.getMerchant(),
  });

  const { data: recentTxns, isLoading: txnsLoading } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => transactionsApi.list({ page: 1, limit: 5 }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <Link to="/links/create">
          <Button>
            <Plus size={16} />
            Create Link
          </Button>
        </Link>
      </div>

      {analyticsLoading ? (
        <Spinner size="lg" className="py-8" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Collected Today"
            value={analytics ? `MWK ${analytics.totalCollectedToday.toLocaleString()}` : 'MWK 0'}
            icon={DollarSign}
            color="bg-primary-light text-primary"
          />
          <SummaryCard
            title="Collected This Month"
            value={analytics ? `MWK ${analytics.totalCollectedThisMonth.toLocaleString()}` : 'MWK 0'}
            icon={TrendingUp}
            color="bg-green-50 text-status-success"
          />
          <SummaryCard
            title="Active Links"
            value={String(analytics?.activeLinksCount ?? 0)}
            icon={Link2}
            color="bg-blue-50 text-status-info"
          />
          <SummaryCard
            title="Refunds This Month"
            value={analytics ? `MWK ${analytics.refundsThisMonth.toLocaleString()}` : 'MWK 0'}
            icon={RefreshCw}
            color="bg-yellow-50 text-status-warning"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-text-primary">Recent Transactions</h2>
              <Link to="/transactions" className="flex items-center gap-1 text-sm text-primary hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {txnsLoading ? (
              <Spinner className="py-8" />
            ) : recentTxns?.data.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-secondary">No transactions yet</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {recentTxns?.data.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{txn.rail}</p>
                      <p className="text-xs text-text-secondary">{formatDate(txn.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MoneyText amount={txn.grossAmount} className="text-sm font-semibold text-text-primary" />
                      <Badge status={txn.status} type="transaction" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link to="/links/create">
                <Button variant="secondary" className="w-full justify-start">
                  <Plus size={16} />
                  Create Payment Link
                </Button>
              </Link>
              <Link to="/links">
                <Button variant="secondary" className="w-full justify-start">
                  <Link2 size={16} />
                  View All Links
                </Button>
              </Link>
              <Link to="/transactions">
                <Button variant="secondary" className="w-full justify-start">
                  <ArrowRight size={16} />
                  View Transactions
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp size={16} />
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
