import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS, apiUrl, mockDb } from './state';

export const dashboardHandlers = [
  http.get(apiUrl(API_ENDPOINTS.DASHBOARD_SUMMARY), () =>
    HttpResponse.json(mockDb.dashboard.summary, {
      status: mockDb.dashboard.summaryStatus,
    }),
  ),
];
