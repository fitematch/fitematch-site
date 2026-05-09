import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import { ListUsersResponse } from '@/services/user/user.types';

export const UserService = {
  list(): Promise<ListUsersResponse> {
    return apiClient<ListUsersResponse>(API_ENDPOINTS.USER, {
      auth: false,
    });
  },
};
