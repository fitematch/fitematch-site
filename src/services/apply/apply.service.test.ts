import { ApplyService } from './apply.service';
import { resetMockDb, mockDb } from '@/tests/mocks/handlers/state';
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

describe('ApplyService', () => {
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

  it('list my applications', async () => {
    const response = await ApplyService.listMine();

    expect(response).toHaveLength(1);
    expect(response[0]).toMatchObject({
      _id: 'apply-1',
      jobId: 'job-1',
      userId: 'user-1',
    });
  });

  it('create apply', async () => {
    const response = await ApplyService.create({
      jobId: 'job-2',
    });

    expect(response).toMatchObject({
      _id: 'apply-2',
      jobId: 'job-2',
      userId: 'user-1',
    });
  });

  it('delete apply', async () => {
    await expect(ApplyService.delete('apply-1')).resolves.toBeUndefined();
    expect(mockDb.apply.mine).toHaveLength(0);
  });

  it('erro 404', async () => {
    await expect(ApplyService.delete('missing-id')).rejects.toMatchObject({
      name: 'ApiError',
      statusCode: 404,
      message: 'Candidatura não encontrada.',
    });
  });
});
