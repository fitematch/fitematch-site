import { CompanyEntity } from '@/types/entities/company.entity';

export type CreateCompanyRequest = Omit<
  CompanyEntity,
  '_id' | 'slug' | 'status' | 'approval' | 'createdAt' | 'updatedAt'
>;

export type CreateCompanyResponse = CompanyEntity;

export type ReadMyCompanyResponse = CompanyEntity;

export type CreateMyCompanyRequest = Omit<
  CompanyEntity,
  '_id' | 'slug' | 'status' | 'audit' | 'approval' | 'createdAt' | 'updatedAt'
> & {
  slug?: string;
};

export type CreateMyCompanyResponse = CompanyEntity;

export type UpdateMyCompanyRequest = Partial<CreateMyCompanyRequest>;

export type UpdateMyCompanyResponse = CompanyEntity;

export type ListCompaniesResponse = CompanyEntity[];

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
      country?: string;
      number?: string;
      isWhatsapp?: boolean;
      isTelegram?: boolean;
    };
  };
  media?: {
    logoUrl?: string;
  };
}

export type ListPublicCompaniesResponse = PublicCompanyResponse[];
