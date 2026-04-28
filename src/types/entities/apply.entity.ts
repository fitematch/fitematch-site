export enum ApplicationStatusEnum {
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export default interface ApplyEntity {
  _id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
