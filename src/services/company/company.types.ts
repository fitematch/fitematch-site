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
  logo?: string;
  contacts?: {
    website?: string;
    address?: {
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    phone?: {
      number?: string;
    };
  };
  media?: {
    logoUrl?: string;
  };
}

export type ListPublicCompaniesResponse = PublicCompanyResponse[];
