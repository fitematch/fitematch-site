import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS, apiUrl, mockDb } from './state';

export const companyHandlers = [
  http.get(apiUrl(API_ENDPOINTS.COMPANY_ME), () => {
    if (mockDb.company.mineStatus !== 200 || !mockDb.company.mine) {
      return HttpResponse.json(
        { message: 'Empresa não encontrada.' },
        { status: mockDb.company.mineStatus }
      );
    }

    return HttpResponse.json(mockDb.company.mine);
  }),
  http.post(apiUrl(API_ENDPOINTS.COMPANY_ME), async ({ request }) => {
    const payload = await request.json();
    mockDb.company.mine = {
      _id: 'company-created',
      slug: 'company-created',
      status: 'active',
      createdAt: '2026-05-05T10:00:00.000Z',
      updatedAt: '2026-05-05T10:00:00.000Z',
      ...payload,
    } as never;

    return HttpResponse.json(mockDb.company.mine, { status: 201 });
  }),
  http.patch(apiUrl(API_ENDPOINTS.COMPANY_ME), async ({ request }) => {
    const payload = await request.json();
    mockDb.company.mine = {
      ...mockDb.company.mine,
      ...payload,
      updatedAt: '2026-05-06T10:00:00.000Z',
    } as never;

    return HttpResponse.json(mockDb.company.mine);
  }),
  http.get(apiUrl(API_ENDPOINTS.COMPANY_PUBLIC), () => {
    if (mockDb.company.publicStatus !== 200) {
      return HttpResponse.json(
        { message: mockDb.company.publicErrorMessage },
        { status: mockDb.company.publicStatus }
      );
    }

    return HttpResponse.json(mockDb.company.publicList);
  }),
];
