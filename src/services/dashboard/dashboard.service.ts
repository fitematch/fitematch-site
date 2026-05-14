import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import { DashboardSummaryResponse } from './dashboard.types';

export const DashboardService = {
  summary(): Promise<DashboardSummaryResponse> {
    return apiClient<DashboardSummaryResponse>(API_ENDPOINTS.DASHBOARD_SUMMARY, {
      auth: false,
    });
  },
};
