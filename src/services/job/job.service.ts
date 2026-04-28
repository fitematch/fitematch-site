import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import {
  CreateJobRequest,
  CreateJobResponse,
  ListJobsResponse,
  ListMyJobsResponse,
  ReadJobResponse,
  UpdateJobRequest,
  UpdateJobResponse,
} from './job.types';

export const JobService = {
  list(): Promise<ListJobsResponse> {
    return apiClient<ListJobsResponse>(API_ENDPOINTS.JOB, {
      auth: false,
    });
  },

  listMine(): Promise<ListMyJobsResponse> {
    return apiClient<ListMyJobsResponse>(API_ENDPOINTS.JOB_ME);
  },

  read(jobId: string): Promise<ReadJobResponse> {
    return apiClient<ReadJobResponse>(API_ENDPOINTS.JOB_BY_ID(jobId), {
      auth: false,
    });
  },

  create(payload: CreateJobRequest): Promise<CreateJobResponse> {
    return apiClient<CreateJobResponse>(API_ENDPOINTS.JOB, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(jobId: string, payload: UpdateJobRequest): Promise<UpdateJobResponse> {
    return apiClient<UpdateJobResponse>(API_ENDPOINTS.JOB_BY_ID(jobId), {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
