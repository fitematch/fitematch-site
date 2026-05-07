import { STORAGE_KEYS } from '@/constants/storage-keys';
import { ApiError } from './api-error';
import { apiClient } from './api-client';

type FetchMock = jest.MockedFunction<typeof fetch>;

function createResponse(
  body: string,
  init?: { status?: number }
): Response {
  const status = init?.status ?? 200;

  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => JSON.parse(body),
    text: async () => body,
  } as Response;
}

function createJsonResponse(body: unknown, init?: { status?: number }) {
  return createResponse(JSON.stringify(body), init);
}

describe('apiClient', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/';
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    const store = new Map<string, string>();
    Object.defineProperty(global, 'localStorage', {
      value: {
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
      },
      configurable: true,
      writable: true,
    });

    global.fetch = jest.fn() as FetchMock;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    global.fetch = originalFetch;
  });

  it('faz request com base url normalizada e content-type padrão', async () => {
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ ok: true })
    );

    await apiClient('/job', {
      method: 'POST',
      body: JSON.stringify({ title: 'Job' }),
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/job', {
      body: JSON.stringify({ title: 'Job' }),
      headers: expect.any(Headers),
      method: 'POST',
    });

    const requestHeaders = (global.fetch as FetchMock).mock.calls[0][1]
      ?.headers as Headers;
    expect(requestHeaders.get('Content-Type')).toBe('application/json');
  });

  it('não adiciona content-type em multipart', async () => {
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ url: '/file.png' })
    );

    await apiClient('/upload', {
      method: 'POST',
      body: new FormData(),
      isMultipart: true,
    });

    const requestHeaders = (global.fetch as FetchMock).mock.calls[0][1]
      ?.headers as Headers;
    expect(requestHeaders.get('Content-Type')).toBeNull();
  });

  it('adiciona authorization quando auth está habilitado e existe token', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ ok: true })
    );

    await apiClient('/profile');

    const requestHeaders = (global.fetch as FetchMock).mock.calls[0][1]
      ?.headers as Headers;
    expect(requestHeaders.get('Authorization')).toBe('Bearer access-token');
  });

  it('não sobrescreve authorization existente', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ ok: true })
    );

    await apiClient('/profile', {
      headers: {
        Authorization: 'Bearer custom-token',
      },
    });

    const requestHeaders = (global.fetch as FetchMock).mock.calls[0][1]
      ?.headers as Headers;
    expect(requestHeaders.get('Authorization')).toBe('Bearer custom-token');
  });

  it('não envia authorization quando auth=false', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ ok: true })
    );

    await apiClient('/job', {
      auth: false,
    });

    const requestHeaders = (global.fetch as FetchMock).mock.calls[0][1]
      ?.headers as Headers;
    expect(requestHeaders.get('Authorization')).toBeNull();
  });

  it('retorna undefined em 204', async () => {
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createResponse('', { status: 204 })
    );

    await expect(apiClient('/job/me/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('retorna undefined quando corpo vem vazio', async () => {
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createResponse('   ', { status: 200 })
    );

    await expect(apiClient('/health-check')).resolves.toBeUndefined();
  });

  it('faz refresh e repete a request quando recebe 401', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'expired-token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');

    (global.fetch as FetchMock)
      .mockResolvedValueOnce(
        createJsonResponse({ message: 'Unauthorized' }, { status: 401 })
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        })
      )
      .mockResolvedValueOnce(createJsonResponse({ ok: true }));

    const response = await apiClient<{ ok: boolean }>('/profile');

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/auth/refresh',
      {
        body: JSON.stringify({ refreshToken: 'refresh-token' }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('new-access-token');
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe('new-refresh-token');
  });

  it('limpa tokens e lança erro quando refresh falha', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'expired-token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');

    (global.fetch as FetchMock)
      .mockResolvedValueOnce(
        createJsonResponse({ message: 'Unauthorized' }, { status: 401 })
      )
      .mockResolvedValueOnce(
        createJsonResponse({ message: 'Refresh failed' }, { status: 401 })
      );

    await expect(apiClient('/profile')).rejects.toBeInstanceOf(ApiError);
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it('não tenta refresh sem refresh token', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'expired-token');
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ message: 'Unauthorized' }, { status: 401 })
    );

    await expect(apiClient('/profile')).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: 401,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('usa mensagem padrão quando erro não traz json válido', async () => {
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createResponse('not-json', { status: 500 })
    );

    await expect(apiClient('/profile')).rejects.toMatchObject({
      message: 'Não foi possível completar a requisição.',
      statusCode: 500,
    });
  });

  it('lança erro quando NEXT_PUBLIC_API_URL não está configurada', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    await expect(apiClient('/profile')).rejects.toThrow(
      'NEXT_PUBLIC_API_URL is not configured. Copy .env.example to .env.local and set the API base URL.'
    );
  });

  it('usa NEXT_PUBLIC_API_BASE_URL como fallback', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:4000/';
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ ok: true })
    );

    await apiClient('/job', {
      auth: false,
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/job', {
      headers: expect.any(Headers),
    });
  });

  it('não tenta refresh quando retry=false', async () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'expired-token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
    (global.fetch as FetchMock).mockResolvedValueOnce(
      createJsonResponse({ message: 'Unauthorized' }, { status: 401 })
    );

    await expect(apiClient('/profile', { retry: false })).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: 401,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
