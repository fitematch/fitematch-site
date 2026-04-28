import { JobEntity } from '@/types/entities/job.entity';

export type ListJobsResponse = JobEntity[];

export type ListMyJobsResponse = JobEntity[];

export type ReadJobResponse = JobEntity;

export type CreateJobRequest = Omit<
  JobEntity,
  '_id' | 'slug' | 'status' | 'createdAt' | 'updatedAt'
>;

export type CreateJobResponse = JobEntity;

export type UpdateJobRequest = Partial<
  Omit<JobEntity, '_id' | 'slug' | 'createdAt' | 'updatedAt'>
>;

export type UpdateJobResponse = JobEntity;
