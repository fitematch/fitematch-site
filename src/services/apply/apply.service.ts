import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import {
  CreateApplyRequest,
  CreateApplyResponse,
  DeleteApplyResponse,
  ReadApplyResponse,
  UpdateApplyStatusRequest,
  UpdateApplyStatusResponse,
} from './apply.types';

export const ApplyService = {
  create(payload: CreateApplyRequest): Promise<CreateApplyResponse> {
    return apiClient<CreateApplyResponse>(API_ENDPOINTS.APPLY, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  read(applyId: string): Promise<ReadApplyResponse> {
    return apiClient<ReadApplyResponse>(API_ENDPOINTS.APPLY_BY_ID(applyId));
  },

  updateStatus(
    applyId: string,
    payload: UpdateApplyStatusRequest,
  ): Promise<UpdateApplyStatusResponse> {
    return apiClient<UpdateApplyStatusResponse>(
      API_ENDPOINTS.APPLY_BY_ID(applyId),
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    );
  },

  delete(applyId: string): Promise<DeleteApplyResponse> {
    return apiClient<DeleteApplyResponse>(API_ENDPOINTS.APPLY_BY_ID(applyId), {
      method: 'DELETE',
    });
  },
};
