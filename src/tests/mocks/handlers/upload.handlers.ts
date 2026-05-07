import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS, apiUrl, mockDb } from './state';

interface UploadRequestLike {
  formData: () => Promise<FormData>;
  headers: {
    get: (name: string) => string | null;
  };
}

async function handleUpload(request: UploadRequestLike, endpoint: string) {
  const formData = await request.formData();
  const file = formData.get('file');

  mockDb.upload.lastUpload = {
    endpoint,
    fileName: file instanceof File ? file.name : '',
    fileType: file instanceof File ? file.type : '',
    contentType: request.headers.get('content-type'),
  };

  return HttpResponse.json({
    url: `/uploads/${endpoint.split('/').pop()}/${mockDb.upload.lastUpload.fileName}`,
  });
}

export const uploadHandlers = [
  http.post(apiUrl(API_ENDPOINTS.UPLOAD_COMPANY_LOGO), ({ request }) =>
    handleUpload(request, API_ENDPOINTS.UPLOAD_COMPANY_LOGO)
  ),
  http.post(apiUrl(API_ENDPOINTS.UPLOAD_JOB_COVER), ({ request }) =>
    handleUpload(request, API_ENDPOINTS.UPLOAD_JOB_COVER)
  ),
  http.post(apiUrl(API_ENDPOINTS.UPLOAD_RESUME), ({ request }) =>
    handleUpload(request, API_ENDPOINTS.UPLOAD_RESUME)
  ),
];
