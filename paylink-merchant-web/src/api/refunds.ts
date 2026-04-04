import apiClient from './client';
import type { Refund, PaginatedResponse } from '../types/api.types';

export interface InitiateRefundPayload {
  transactionId: string;
  amount: number;
  reason: string;
}

export interface ListRefundsParams {
  page?: number;
  limit?: number;
}

export const refundsApi = {
  initiate: async (payload: InitiateRefundPayload): Promise<Refund> => {
    const { data } = await apiClient.post<Refund>('/refunds', payload);
    return data;
  },

  getById: async (id: string): Promise<Refund> => {
    const { data } = await apiClient.get<Refund>(`/refunds/${id}`);
    return data;
  },

  list: async (params?: ListRefundsParams): Promise<PaginatedResponse<Refund>> => {
    const { data } = await apiClient.get<PaginatedResponse<Refund>>('/refunds', { params });
    return data;
  },
};
