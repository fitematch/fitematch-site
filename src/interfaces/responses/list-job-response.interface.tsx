import { Job } from '@/interfaces/job.interface';

export interface JobPaginationMetadata {
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  totalItems?: number;
}

export interface ListJobResponseInterface {
  data: Job[];
  metadata?: {
    pagination?: JobPaginationMetadata;
  };
}
