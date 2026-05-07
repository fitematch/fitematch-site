import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS, apiUrl, mockDb } from './state';

export const applyHandlers = [
  http.get(apiUrl(API_ENDPOINTS.APPLY_ME), () => {
    if (mockDb.apply.listStatus !== 200) {
      return HttpResponse.json(
        { message: 'Não foi possível carregar candidaturas.' },
        { status: mockDb.apply.listStatus }
      );
    }

    return HttpResponse.json(mockDb.apply.mine);
  }),
  http.get(apiUrl(API_ENDPOINTS.APPLY_BY_ID(':applyId')), ({ params }) => {
    const applyId = String(params.applyId);
    const application = mockDb.apply.mine.find((item) => item._id === applyId);

    if (!application) {
      return HttpResponse.json(
        { message: mockDb.apply.errorMessage },
        { status: 404 }
      );
    }

    return HttpResponse.json(application);
  }),
  http.post(apiUrl(API_ENDPOINTS.APPLY), async ({ request }) => {
    if (mockDb.apply.createStatus !== 201) {
      return HttpResponse.json(
        { message: mockDb.apply.errorMessage },
        { status: mockDb.apply.createStatus }
      );
    }

    const payload = (await request.json()) as { jobId: string };
    const createdApply = {
      _id: `apply-${mockDb.apply.mine.length + 1}`,
      jobId: payload.jobId,
      userId: 'user-1',
      status: 'applied',
    };

    mockDb.apply.mine.push(createdApply as never);

    return HttpResponse.json(createdApply, { status: 201 });
  }),
  http.delete(apiUrl(API_ENDPOINTS.APPLY_BY_ID(':applyId')), ({ params }) => {
    const applyId = String(params.applyId);
    const index = mockDb.apply.mine.findIndex((item) => item._id === applyId);

    if (index === -1) {
      return HttpResponse.json(
        { message: mockDb.apply.errorMessage },
        { status: 404 }
      );
    }

    mockDb.apply.mine.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
