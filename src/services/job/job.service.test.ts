/** @jest-environment node */

import { JobService } from './job.service';
import { mockDb, resetMockDb } from '@/tests/mocks/handlers/state';
import { server } from '@/tests/mocks/server';

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('JobService', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
      writable: true,
    });
    localStorage.clear();
    resetMockDb();
    localStorage.setItem('fitematch.access_token', 'access-token');
  });

  afterEach(() => {
    server.resetHandlers();
    localStorage.clear();
  });

  afterAll(() => {
    server.close();
  });

  it('list jobs', async () => {
    const response = await JobService.list();

    expect(response).toHaveLength(1);
    expect(response[0].title).toBe('Personal Trainer');
  });

  it('list my jobs', async () => {
    const response = await JobService.listMine();

    expect(response).toHaveLength(1);
    expect(response[0]._id).toBe('job-1');
  });

  it('create job', async () => {
    const response = await JobService.create({
      title: 'Professor de Pilates',
      description: 'Aulas em studio boutique.',
      companyId: 'company-1',
      slots: 1,
      contractType: 'clt',
      benefits: {
        salary: 4200,
      },
      requirements: {},
      media: {},
    });

    expect(response._id).toBe('job-2');
    expect(response.title).toBe('Professor de Pilates');
  });

  it('read job', async () => {
    const response = await JobService.read('job-1');

    expect(response._id).toBe('job-1');
    expect(response.title).toBe('Personal Trainer');
  });

  it('create my job', async () => {
    const response = await JobService.createMine({
      title: 'Coordenador Técnico',
      description: 'Gestão de equipe técnica.',
      companyId: 'company-1',
      slots: 1,
      contractType: 'pj',
      benefits: {
        salary: 6000,
      },
      requirements: {},
      media: {},
    });

    expect(response._id).toBe('job-2');
    expect(response.title).toBe('Coordenador Técnico');
    expect(mockDb.job.mine).toHaveLength(2);
  });

  it('update job', async () => {
    const response = await JobService.update('job-1', {
      title: 'Personal Trainer Senior',
    });

    expect(response.title).toBe('Personal Trainer Senior');
    expect(response.updatedAt).toBe('2026-05-06T10:00:00.000Z');
  });

  it('update my job', async () => {
    const response = await JobService.updateMine('job-1', {
      title: 'Personal Trainer Elite',
    });

    expect(response.title).toBe('Personal Trainer Elite');
    expect(mockDb.job.mine[0].title).toBe('Personal Trainer Elite');
  });

  it('delete job', async () => {
    await expect(JobService.deleteMine('job-1')).resolves.toBeUndefined();
    expect(mockDb.job.mine).toHaveLength(0);
  });
});
