/** @jest-environment node */

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { AuthService } from './auth.service';
import { resetMockDb, mockDb } from '@/tests/mocks/handlers/state';
import { ApiError } from '@/services/http/api-error';
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

describe('AuthService', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    Object.defineProperty(global, 'window', {
      value: global,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(global, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
      writable: true,
    });
    localStorage.clear();
    resetMockDb();
  });

  afterEach(() => {
    server.resetHandlers();
    localStorage.clear();
  });

  afterAll(() => {
    server.close();
  });

  it('sign-in sucesso', async () => {
    const response = await AuthService.signIn({
      email: 'rebeca@fitematch.com',
      password: '123456',
    });

    expect(response.accessToken).toBe('access-token');
    expect(response.refreshToken).toBe('refresh-token');
    expect(response.user.email).toBe('rebeca@fitematch.com');
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('access-token');
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('refresh-token');
  });

  it('sign-in erro 401', async () => {
    mockDb.auth.signInStatus = 401;

    await expect(
      AuthService.signIn({
        email: 'rebeca@fitematch.com',
        password: 'errada',
      })
    ).rejects.toMatchObject<ApiError>({
      name: 'ApiError',
      statusCode: 401,
      message: 'Credenciais inválidas.',
    });
  });

  it('get me sucesso', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    const response = await AuthService.me();

    expect(response._id).toBe('user-1');
    expect(response.name).toBe('Rebeca Chambers');
  });

  it('sign-out sucesso', async () => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    const response = await AuthService.signOut();

    expect(response).toEqual({
      message: 'Sessão encerrada com sucesso.',
    });
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('sign-up sucesso', async () => {
    server.use(
      http.post(apiUrl(API_ENDPOINTS.AUTH_SIGN_UP), async ({ request }) => {
        const payload = await request.json();
        return HttpResponse.json({
          ...payload,
          _id: 'user-2',
        });
      })
    );

    const response = await AuthService.signUp({
      name: 'Teste',
      email: 'teste@fitematch.com',
      password: '123456',
      birthday: '1990-01-01',
      productRole: 'candidate' as never,
    });

    expect(response).toMatchObject({
      _id: 'user-2',
    } as never);
    expect(response.email).toBe('teste@fitematch.com');
  });

  it('update me sucesso', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    server.use(
      http.patch(apiUrl(API_ENDPOINTS.AUTH_ME), async ({ request }) => {
        const payload = await request.json();
        return HttpResponse.json({
          ...mockDb.auth.meUser,
          ...payload,
        });
      })
    );

    const response = await AuthService.updateMe({
      name: 'Rebeca Atualizada',
    });

    expect(response.name).toBe('Rebeca Atualizada');
  });

  it('request activation code sucesso', async () => {
    server.use(
      http.post(apiUrl(API_ENDPOINTS.AUTH_ACTIVATION_CODE), () =>
        HttpResponse.json({ message: 'Código enviado.' })
      )
    );

    const response = await AuthService.requestActivationCode({
      email: 'rebeca@fitematch.com',
    });

    expect(response.message).toBe('Código enviado.');
  });

  it('activate account sucesso', async () => {
    server.use(
      http.post(apiUrl(API_ENDPOINTS.AUTH_ACTIVATE_ACCOUNT), () =>
        HttpResponse.json({ message: 'Conta ativada.' })
      )
    );

    const response = await AuthService.activateAccount({
      email: 'rebeca@fitematch.com',
      code: '123456',
    });

    expect(response.message).toBe('Conta ativada.');
  });

  it('refresh sucesso atualiza tokens', async () => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
    server.use(
      http.post(apiUrl(API_ENDPOINTS.AUTH_REFRESH), async ({ request }) => {
        const payload = await request.json();
        return HttpResponse.json({
          accessToken: `${payload.refreshToken}-new-access`,
          refreshToken: `${payload.refreshToken}-new-refresh`,
        });
      })
    );

    const response = await AuthService.refresh();

    expect(response.accessToken).toBe('refresh-token-new-access');
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe(
      'refresh-token-new-access'
    );
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe(
      'refresh-token-new-refresh'
    );
  });

  it('sign-out retorna fallback local em 401', async () => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    mockDb.auth.signOutStatus = 401;

    const response = await AuthService.signOut();

    expect(response).toEqual({
      message: 'Sessão local encerrada.',
    });
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('sign-out relanca erro diferente de 401 e limpa tokens', async () => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    mockDb.auth.signOutStatus = 500;

    await expect(AuthService.signOut()).rejects.toMatchObject({
      name: 'ApiError',
      statusCode: 500,
      message: 'Sessão encerrada com sucesso.',
    });
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('list sessions sucesso', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    const response = await AuthService.listSessions();

    expect(response).toHaveLength(1);
    expect(response[0].id).toBe('session-1');
  });

  it('revoke session sucesso', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    await expect(AuthService.revokeSession('session-1')).resolves.toBeUndefined();
    expect(mockDb.auth.sessions).toHaveLength(0);
  });
});
