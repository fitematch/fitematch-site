import { JobEntity } from '@/types/entities/job.entity';

export type ListJobsResponse = JobEntity[];

export type ListMyJobsResponse = JobEntity[];

export type ReadJobResponse = JobEntity;

export type CreateJobRequest = Omit<
  JobEntity,
  '_id' | 'slug' | 'company' | 'status' | 'createdAt' | 'updatedAt'
>;

export type CreateJobResponse = JobEntity;

export type UpdateJobRequest = Partial<
  Omit<JobEntity, '_id' | 'slug' | 'company' | 'createdAt' | 'updatedAt'>
>;

export type UpdateJobResponse = JobEntity;

export type CreateMyJobRequest = Omit<
  JobEntity,
  | '_id'
  | 'slug'
  | 'company'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
> & {
  slug?: string;
};

export type CreateMyJobResponse = JobEntity;

export type UpdateMyJobRequest = Partial<CreateMyJobRequest>;

export type UpdateMyJobResponse = JobEntity;

export type DeleteMyJobResponse = void;
