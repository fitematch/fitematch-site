import { http, HttpResponse, MockHandler } from '@/tests/mocks/msw-lite';
import { authHandlers } from './auth.handlers';
import { applyHandlers } from './apply.handlers';
import { companyHandlers } from './company.handlers';
import { jobHandlers } from './job.handlers';
import { uploadHandlers } from './upload.handlers';
import { API_ENDPOINTS, apiUrl, resetMockDb } from './state';

export const handlers: MockHandler[] = [
  http.get(apiUrl(API_ENDPOINTS.HEALTH_CHECK), () =>
    HttpResponse.json({
      status: 'ok',
    })
  ),
  ...authHandlers,
  ...applyHandlers,
  ...companyHandlers,
  ...jobHandlers,
  ...uploadHandlers,
];

export { resetMockDb };
