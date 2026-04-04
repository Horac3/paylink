import apiClient from './client';
import type { Transaction, PaginatedResponse, TransactionStatus } from '../types/api.types';

export interface ListTransactionsParams {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  from?: string;
  to?: string;
}

export const transactionsApi = {
  list: async (params?: ListTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const { data } = await apiClient.get<Transaction>(`/transactions/${id}`);
    return data;
  },
};
