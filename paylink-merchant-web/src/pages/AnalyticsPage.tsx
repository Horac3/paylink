import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { analyticsApi } from '../api/analytics';
import type { AnalyticsParams } from '../api/analytics';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { MoneyText } from '../components/ui/MoneyText';
import { formatDateShort } from '../utils/formatDate';

const PERIODS: { label: string; value: AnalyticsParams['period'] }[] = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
];

const PIE_COLORS = ['#1B4F8C', '#16A34A', '#D97706', '#DC2626', '#2563EB'];

export function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsParams['period']>('30d');

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'merchant', period],
    queryFn: () => analyticsApi.getMerchant({ period }),
  });

  const dailyVolume = data?.dailyVolume ?? [];
  const railDistribution = data?.railDistribution ?? [];
  const topLinks = data?.topLinks ?? [];

  const chartData = dailyVolume.map((d) => ({
    date: formatDateShort(d.date),
    volume: d.volume,
    count: d.count,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                period === value
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" className="py-20" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-text-secondary">Collected Today</p>
              <MoneyText
                amount={data?.totalCollectedToday ?? 0}
                className="mt-1 text-2xl font-bold text-text-primary block"
              />
            </Card>
            <Card>
              <p className="text-sm text-text-secondary">This Month</p>
              <MoneyText
                amount={data?.totalCollectedThisMonth ?? 0}
                className="mt-1 text-2xl font-bold text-text-primary block"
              />
            </Card>
            <Card>
              <p className="text-sm text-text-secondary">Active Links</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {data?.activeLinksCount ?? 0}
              </p>
            </Card>
          </div>

          {/* Daily Volume Line Chart */}
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">Daily Volume (MWK)</h2>
            {chartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-secondary">No data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <Tooltip
                    formatter={(v) => [`MWK ${Number(v).toLocaleString()}`, 'Volume']}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#1B4F8C"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Transaction Count Bar Chart */}
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Daily Transaction Count
              </h2>
              {chartData.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-secondary">No data for this period</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1B4F8C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Rail Distribution Pie Chart */}
            <Card>
              <h2 className="text-base font-semibold text-text-primary mb-4">Rail Distribution</h2>
              {railDistribution.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-secondary">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={railDistribution}
                      dataKey="count"
                      nameKey="rail"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                    >
                      {railDistribution.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Top Links Table */}
          <Card>
            <h2 className="text-base font-semibold text-text-primary mb-4">Top 5 Links</h2>
            {topLinks.length === 0 ? (
              <p className="py-4 text-sm text-text-secondary">No link data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left text-xs font-semibold uppercase text-text-secondary">
                        Slug
                      </th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase text-text-secondary">
                        Type
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold uppercase text-text-secondary">
                        Transactions
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold uppercase text-text-secondary">
                        Total Collected
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLinks.map((link) => (
                      <tr key={link.id} className="border-b border-border last:border-0">
                        <td className="py-2 font-mono text-xs text-text-secondary">{link.slug}</td>
                        <td className="py-2 text-xs font-medium">{link.type}</td>
                        <td className="py-2 text-right">{link.transactionCount}</td>
                        <td className="py-2 text-right font-semibold">
                          <MoneyText amount={link.totalCollected} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
