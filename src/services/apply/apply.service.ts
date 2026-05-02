import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import {
  CreateApplyRequest,
  CreateApplyResponse,
  DeleteApplyResponse,
  ListAppliesByJobResponse,
  ListMyAppliesResponse,
  ReadApplyResponse,
  UpdateApplyStatusRequest,
  UpdateApplyStatusResponse,
} from './apply.types';
import { normalizeApply, normalizeApplyList } from './apply.utils';

export const ApplyService = {
  async create(payload: CreateApplyRequest): Promise<CreateApplyResponse> {
    const response = await apiClient<CreateApplyResponse>(API_ENDPOINTS.APPLY, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return normalizeApply(response);
  },

  async listMine(): Promise<ListMyAppliesResponse> {
    const response = await apiClient<ListMyAppliesResponse>(API_ENDPOINTS.APPLY_ME);

    return normalizeApplyList(response);
  },

  async listByJob(jobId: string): Promise<ListAppliesByJobResponse> {
    const response = await apiClient<ListAppliesByJobResponse>(
      API_ENDPOINTS.APPLY_BY_JOB_ID(jobId),
    );

    return normalizeApplyList(response);
  },

  async read(applyId: string): Promise<ReadApplyResponse> {
    const response = await apiClient<ReadApplyResponse>(
      API_ENDPOINTS.APPLY_BY_ID(applyId),
    );

    return normalizeApply(response);
  },

  async updateStatus(
    applyId: string,
    payload: UpdateApplyStatusRequest,
  ): Promise<UpdateApplyStatusResponse> {
    const response = await apiClient<UpdateApplyStatusResponse>(
      API_ENDPOINTS.APPLY_BY_ID(applyId),
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );

    return normalizeApply(response);
  },

  delete(applyId: string): Promise<DeleteApplyResponse> {
    return apiClient<DeleteApplyResponse>(API_ENDPOINTS.APPLY_BY_ID(applyId), {
      method: 'DELETE',
    });
  },
};
