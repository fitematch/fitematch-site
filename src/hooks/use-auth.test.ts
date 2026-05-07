import { act, waitFor } from '@testing-library/react';
import { useAuth } from './use-auth';
import { renderHookWithProviders } from '@/tests/utils/render-hook-with-providers';
import { resetMockDb } from '@/tests/mocks/handlers';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { mockDb } from '@/tests/mocks/handlers/state';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiUrl } from '@/tests/mocks/handlers/state';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    resetMockDb();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('retorna usuário autenticado', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('rebeca@fitematch.com');
  });

  it('retorna null quando logout', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');

    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loading inicial', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    const { result } = renderHookWithProviders(() => useAuth());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('bootstrap sem token mantém usuário nulo', async () => {
    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('bootstrap com erro em me limpa tokens', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
    mockDb.auth.meStatus = 500;

    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('refreshMe sem token finaliza sem usuário', async () => {
    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshMe();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('refreshMe com token recarrega o usuário', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');

    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.auth.meUser = {
      ...mockDb.auth.meUser!,
      name: 'Rebeca Atualizada',
    };

    await act(async () => {
      await result.current.refreshMe();
    });

    expect(result.current.user?.name).toBe('Rebeca Atualizada');
  });

  it('refreshMe com erro limpa tokens e usuário', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');

    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.auth.meStatus = 500;

    await act(async () => {
      await result.current.refreshMe();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('signIn autentica e retorna user no response', async () => {
    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let response: Awaited<ReturnType<typeof result.current.signIn>> | undefined;

    await act(async () => {
      response = await result.current.signIn({
        email: 'rebeca@fitematch.com',
        password: '123456',
      });
    });

    expect(response?.user.email).toBe('rebeca@fitematch.com');
    expect(result.current.user?.email).toBe('rebeca@fitematch.com');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('signIn com erro encerra loading e propaga erro', async () => {
    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.auth.signInStatus = 401;

    await act(async () => {
      await expect(
        result.current.signIn({
          email: 'rebeca@fitematch.com',
          password: 'errada',
        })
      ).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('updateMe atualiza usuário no contexto', async () => {
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

    const { result } = renderHookWithProviders(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateMe({
        name: 'Rebeca Nova',
      });
    });

    expect(result.current.user?.name).toBe('Rebeca Nova');
  });
});
