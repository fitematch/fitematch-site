import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import {
  CreateCompanyRequest,
  CreateCompanyResponse,
  CreateMyCompanyRequest,
  CreateMyCompanyResponse,
  ListPublicCompaniesResponse,
  ReadMyCompanyResponse,
  UpdateMyCompanyRequest,
  UpdateMyCompanyResponse,
} from './company.types';

export const CompanyService = {
  create(payload: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    return apiClient<CreateCompanyResponse>(API_ENDPOINTS.COMPANY, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  readMine(): Promise<ReadMyCompanyResponse> {
    return apiClient<ReadMyCompanyResponse>(API_ENDPOINTS.COMPANY_ME);
  },

  createMine(
    payload: CreateMyCompanyRequest,
  ): Promise<CreateMyCompanyResponse> {
    return apiClient<CreateMyCompanyResponse>(API_ENDPOINTS.COMPANY_ME, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateMine(
    payload: UpdateMyCompanyRequest,
  ): Promise<UpdateMyCompanyResponse> {
    return apiClient<UpdateMyCompanyResponse>(API_ENDPOINTS.COMPANY_ME, {
      method: 'PATCH',
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
