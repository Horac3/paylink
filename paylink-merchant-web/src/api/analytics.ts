import apiClient from './client';
import type { MerchantAnalytics, LinkAnalytics } from '../types/api.types';

export interface AnalyticsParams {
  period?: '7d' | '30d' | '90d';
}

export const analyticsApi = {
  getMerchant: async (params?: AnalyticsParams): Promise<MerchantAnalytics> => {
    const { data } = await apiClient.get<MerchantAnalytics>('/analytics/merchant', { params });
    return data;
  },

  getLinkAnalytics: async (id: string, params?: AnalyticsParams): Promise<LinkAnalytics> => {
    const { data } = await apiClient.get<LinkAnalytics>(`/analytics/links/${id}`, { params });
    return data;
  },
};
