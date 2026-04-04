import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import { transactionsApi } from '../api/transactions';
import type { TransactionStatus } from '../types/api.types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MoneyText } from '../components/ui/MoneyText';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Table, Th, Td } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatDate } from '../utils/formatDate';
import { useDebounce } from '../hooks/useDebounce';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const debouncedFrom = useDebounce(from, 400);
  const debouncedTo = useDebounce(to, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, status, debouncedFrom, debouncedTo],
    queryFn: () =>
      transactionsApi.list({
        page,
        limit: 10,
        status: status ? (status as TransactionStatus) : undefined,
        from: debouncedFrom || undefined,
        to: debouncedTo || undefined,
      }),
  });

  const handleFilterChange = () => setPage(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleFilterChange();
            }}
            className="w-44"
          />
          <div className="flex items-center gap-2">
            <Input
              type="date"
              placeholder="From"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                handleFilterChange();
              }}
              className="w-36"
            />
            <span className="text-text-secondary text-sm">to</span>
            <Input
              type="date"
              placeholder="To"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                handleFilterChange();
              }}
              className="w-36"
            />
          </div>
        </div>

        {isLoading ? (
          <Spinner className="py-16" />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={<ArrowLeftRight size={40} />}
            title="No transactions"
            description="Transactions will appear here once payments are made"
          />
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Rail</Th>
                  <Th>Gross Amount</Th>
                  <Th>Fee</Th>
                  <Th>Net Amount</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <Td className="text-text-secondary">{formatDate(txn.createdAt)}</Td>
                    <Td>
                      <span className="text-xs font-medium">{txn.rail}</span>
                    </Td>
                    <Td>
                      <MoneyText amount={txn.grossAmount} className="font-medium" />
                    </Td>
                    <Td className="text-text-secondary">
                      <MoneyText amount={txn.feeAmount} />
                    </Td>
                    <Td>
                      <MoneyText amount={txn.netAmount} className="font-semibold text-status-success" />
                    </Td>
                    <Td>
                      <Badge status={txn.status} type="transaction" />
                    </Td>
                    <Td>
                      <Link to={`/transactions/${txn.id}`} className="text-sm text-primary hover:underline">
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
