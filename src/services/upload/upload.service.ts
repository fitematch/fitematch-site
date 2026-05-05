import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';

interface UploadResponse {
  url: string;
}

async function uploadFile(endpoint: string, file: File): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append('file', file);

  return apiClient<UploadResponse>(endpoint, {
    method: 'POST',
    body: formData,
    isMultipart: true,
  });
}

export const UploadService = {
  uploadCompanyLogo(file: File): Promise<UploadResponse> {
    return uploadFile(API_ENDPOINTS.UPLOAD_COMPANY_LOGO, file);
  },

  uploadJobCover(file: File): Promise<UploadResponse> {
    return uploadFile(API_ENDPOINTS.UPLOAD_JOB_COVER, file);
  },

  uploadResume(file: File): Promise<UploadResponse> {
    return uploadFile(API_ENDPOINTS.UPLOAD_RESUME, file);
  },
};
