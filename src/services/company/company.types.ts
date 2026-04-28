import { CompanyEntity } from '@/types/entities/company.entity';

export type CreateCompanyRequest = Omit<
  CompanyEntity,
  '_id' | 'slug' | 'status' | 'approval' | 'createdAt' | 'updatedAt'
>;

export type CreateCompanyResponse = CompanyEntity;
