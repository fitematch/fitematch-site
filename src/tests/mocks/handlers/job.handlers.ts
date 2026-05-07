import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS, apiUrl, mockDb } from './state';

export const jobHandlers = [
  http.get(apiUrl(API_ENDPOINTS.JOB), () => {
    if (mockDb.job.listStatus !== 200) {
      return HttpResponse.json(
        { message: mockDb.job.listErrorMessage },
        { status: mockDb.job.listStatus }
      );
    }

    return HttpResponse.json(mockDb.job.list);
  }),
  http.get(apiUrl(API_ENDPOINTS.JOB_ME), () => {
    if (mockDb.job.mineStatus !== 200) {
      return HttpResponse.json(
        { message: 'Não foi possível carregar minhas vagas.' },
        { status: mockDb.job.mineStatus }
      );
    }

    return HttpResponse.json(mockDb.job.mine);
  }),
  http.get(apiUrl(API_ENDPOINTS.JOB_BY_ID(':jobId')), ({ params }) => {
    const jobId = String(params.jobId);
    const job = mockDb.job.list.find((item) => item._id === jobId);

    if (!job) {
      return HttpResponse.json({ message: 'Vaga não encontrada.' }, { status: 404 });
    }

    return HttpResponse.json(job);
  }),
  http.post(apiUrl(API_ENDPOINTS.JOB_ME), async ({ request }) => {
    const payload = await request.json();
    const createdJob = {
      _id: `job-${mockDb.job.mine.length + 1}`,
      slug: `job-${mockDb.job.mine.length + 1}`,
      status: 'pending',
      createdAt: '2026-05-05T10:00:00.000Z',
      updatedAt: '2026-05-05T10:00:00.000Z',
      company: mockDb.company.mine,
      ...payload,
    };

    mockDb.job.mine.push(createdJob as never);
    mockDb.job.list.push(createdJob as never);

    return HttpResponse.json(createdJob, { status: 201 });
  }),
  http.post(apiUrl(API_ENDPOINTS.JOB), async ({ request }) => {
    const payload = await request.json();
    const createdJob = {
      _id: `job-${mockDb.job.list.length + 1}`,
      slug: `job-${mockDb.job.list.length + 1}`,
      status: 'pending',
      createdAt: '2026-05-05T10:00:00.000Z',
      updatedAt: '2026-05-05T10:00:00.000Z',
      company: mockDb.company.mine,
      ...payload,
    };

    mockDb.job.list.push(createdJob as never);

    return HttpResponse.json(createdJob, { status: 201 });
  }),
  http.patch(apiUrl(API_ENDPOINTS.JOB_ME_BY_ID(':jobId')), async ({ params, request }) => {
    const payload = await request.json();
    const jobId = String(params.jobId);
    const mineIndex = mockDb.job.mine.findIndex((item) => item._id === jobId);

    if (mineIndex === -1) {
      return HttpResponse.json({ message: 'Vaga não encontrada.' }, { status: 404 });
    }

    const updatedJob = {
      ...mockDb.job.mine[mineIndex],
      ...payload,
      updatedAt: '2026-05-06T10:00:00.000Z',
    } as never;

    mockDb.job.mine[mineIndex] = updatedJob;

    const listIndex = mockDb.job.list.findIndex((item) => item._id === jobId);

    if (listIndex !== -1) {
      mockDb.job.list[listIndex] = updatedJob;
    }

    return HttpResponse.json(updatedJob);
  }),
  http.patch(apiUrl(API_ENDPOINTS.JOB_BY_ID(':jobId')), async ({ params, request }) => {
    const payload = await request.json();
    const jobId = String(params.jobId);
    const index = mockDb.job.list.findIndex((item) => item._id === jobId);

    if (index === -1) {
      return HttpResponse.json({ message: 'Vaga não encontrada.' }, { status: 404 });
    }

    mockDb.job.list[index] = {
      ...mockDb.job.list[index],
      ...payload,
      updatedAt: '2026-05-06T10:00:00.000Z',
    } as never;

    return HttpResponse.json(mockDb.job.list[index]);
  }),
  http.delete(apiUrl(API_ENDPOINTS.JOB_ME_BY_ID(':jobId')), ({ params }) => {
    const jobId = String(params.jobId);
    const index = mockDb.job.mine.findIndex((item) => item._id === jobId);

    if (index === -1) {
      return HttpResponse.json({ message: 'Vaga não encontrada.' }, { status: 404 });
    }

    mockDb.job.mine.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
