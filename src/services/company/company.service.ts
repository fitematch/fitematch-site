import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import { CreateCompanyRequest, CreateCompanyResponse } from './company.types';

export const CompanyService = {
  create(payload: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    return apiClient<CreateCompanyResponse>(API_ENDPOINTS.COMPANY, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
