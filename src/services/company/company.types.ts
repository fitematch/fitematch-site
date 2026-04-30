import { CompanyEntity } from '@/types/entities/company.entity';

export type CreateCompanyRequest = Omit<
  CompanyEntity,
  '_id' | 'slug' | 'status' | 'approval' | 'createdAt' | 'updatedAt'
>;

export type CreateCompanyResponse = CompanyEntity;

export interface PublicCompanyResponse {
  _id: string;
  slug: string;
  tradeName: string;
  logo?: string; // URL do logo vinda da API
  contacts?: {
    address?: {
      city?: string;
      state?: string;
    };
  };
  media?: {
    logoUrl?: string;
  };
}

export type ListPublicCompaniesResponse = PublicCompanyResponse[];
