import { CompanyService } from './company.service';
import { mockDb, resetMockDb } from '@/tests/mocks/handlers/state';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiUrl } from '@/tests/mocks/handlers/state';

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

describe('CompanyService', () => {
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

  it('GET /company/me com empresa', async () => {
    const response = await CompanyService.readMine();

    expect(response._id).toBe('company-1');
    expect(response.tradeName).toBe('Smart Fit');
  });

  it('GET /company/me vazio/404', async () => {
    mockDb.company.mineStatus = 404;
    mockDb.company.mine = null;

    await expect(CompanyService.readMine()).rejects.toMatchObject({
      name: 'ApiError',
      statusCode: 404,
      message: 'Empresa não encontrada.',
    });
  });

  it('POST /company/me', async () => {
    const response = await CompanyService.createMine({
      tradeName: 'Blue Fit',
      legalName: 'Blue Fit LTDA',
      contacts: {
        email: 'contato@bluefit.com',
        website: 'https://bluefit.com',
        phone: {
          country: '+55',
          number: '11999999999',
        },
        address: {
          street: 'Rua Azul',
          number: '10',
          city: 'São Paulo',
          state: 'SP',
          country: 'BR',
          zipCode: '01000-000',
        },
      },
      documents: {},
      media: {},
    });

    expect(response.tradeName).toBe('Blue Fit');
    expect(response._id).toBe('company-created');
  });

  it('PATCH /company/me', async () => {
    const response = await CompanyService.updateMine({
      tradeName: 'Smart Fit Premium',
    });

    expect(response.tradeName).toBe('Smart Fit Premium');
    expect(response.updatedAt).toBe('2026-05-06T10:00:00.000Z');
  });

  it('POST /company', async () => {
    server.use(
      http.post(apiUrl(API_ENDPOINTS.COMPANY), async ({ request }) => {
        const payload = await request.json();
        return HttpResponse.json({
          _id: 'company-public-created',
          ...payload,
        });
      })
    );

    const response = await CompanyService.create({
      tradeName: 'Nova Academia',
      legalName: 'Nova Academia LTDA',
      contacts: {
        email: 'contato@novaacademia.com',
        phone: {
          country: '+55',
          number: '11999999999',
        },
        address: {
          street: 'Rua Nova',
          number: '100',
          city: 'São Paulo',
          state: 'SP',
          country: 'BR',
          zipCode: '01000-000',
        },
      },
      documents: {},
      media: {},
    });

    expect(response._id).toBe('company-public-created');
    expect(response.tradeName).toBe('Nova Academia');
  });

  it('GET /company/public', async () => {
    const response = await CompanyService.listPublic();

    expect(response).toHaveLength(1);
    expect(response[0].tradeName).toBe('Smart Fit');
  });
});
