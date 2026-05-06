export enum ApplicationStatusEnum {
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export interface ApplicationDetails {
  jobTitle?: string;
  tradeName?: string;
  logoUrl?: string;
}

export interface ApplicationUserSummary {
  name?: string;
  birthday?: string;
  resumeUrl?: string;
}

export default interface ApplyEntity {
  _id: string;
  id?: string;
  jobId: string;
  userId: string;
  user?: ApplicationUserSummary;
  status: ApplicationStatusEnum;
  details?: ApplicationDetails;
  createdAt?: Date;
  updatedAt?: Date;
}
