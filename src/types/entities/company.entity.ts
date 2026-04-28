import {
  AddressEntity,
  PhoneEntity,
  SocialEntity,
} from './user.entity';

export interface ContactsEntity {
  email: string;
  website?: string;
  phone: PhoneEntity;
  address: AddressEntity;
  social?: SocialEntity;
}

export interface CompanyAuditEntity {
  createdByUserId?: string;
}

export interface CompanyApprovalEntity {
  approvedAt?: Date;
  approvedByUserId?: string;
}

export interface CompanyDocumentsEntity {
  cnpj?: string;
  isVerified?: boolean;
}

export interface CompanyMediaEntity {
  logoUrl?: string;
}

export enum CompanyStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface CompanyEntity {
  _id: string;
  slug: string;
  tradeName: string;
  legalName?: string;
  contacts: ContactsEntity;
  documents: CompanyDocumentsEntity;
  media: CompanyMediaEntity;
  audit?: CompanyAuditEntity;
  approval?: CompanyApprovalEntity;
  status: CompanyStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
