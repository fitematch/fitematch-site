import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import {
  CreateCompanyRequest,
  CreateCompanyResponse,
  ListPublicCompaniesResponse,
} from './company.types';

export const CompanyService = {
  create(payload: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    return apiClient<CreateCompanyResponse>(API_ENDPOINTS.COMPANY, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listPublic(): Promise<ListPublicCompaniesResponse> {
    return apiClient<ListPublicCompaniesResponse>(
      API_ENDPOINTS.COMPANY_PUBLIC,
      {
        auth: false,
      },
    );
  },
};
