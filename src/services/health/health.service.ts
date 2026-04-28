import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import { HealthCheckResponse } from './health.types';

export const HealthService = {
  check(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>(API_ENDPOINTS.HEALTH_CHECK, {
      auth: false,
    });
  },
};
