import apiClient from './client';
import type { PaymentLink, PaginatedResponse, LinkStatus } from '../types/api.types';

export interface CreateLinkPayload {
  type: 'INVOICE' | 'SUBSCRIPTION' | 'DONATION' | 'REQUEST';
  amount?: string;
  currency: string;
  description?: string;
  expiresAt?: string;
  metadata?: Record<string, string>;
  recipientMsisdn?: string;
  providerCode?: string;
  recurrenceInterval?: string;
  recurrenceMaxCycles?: number;
}

export interface ListLinksParams {
  page?: number;
  limit?: number;
  status?: LinkStatus;
}

export const linksApi = {
  create: async (payload: CreateLinkPayload): Promise<PaymentLink> => {
    const { data } = await apiClient.post<PaymentLink>('/links', payload);
    return data;
  },

  list: async (params?: ListLinksParams): Promise<PaginatedResponse<PaymentLink>> => {
    const { data } = await apiClient.get<PaginatedResponse<PaymentLink>>('/links', { params });
    return data;
  },

  getById: async (id: string): Promise<PaymentLink> => {
    const { data } = await apiClient.get<PaymentLink>(`/links/${id}`);
    return data;
  },

  cancel: async (id: string): Promise<PaymentLink> => {
    const { data } = await apiClient.delete<PaymentLink>(`/links/${id}`);
    return data;
  },
};
