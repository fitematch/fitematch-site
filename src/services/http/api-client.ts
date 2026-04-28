import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiError } from './api-error';
import { TokenStorage } from './token-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not configured. Copy .env.example to .env.local and set the API base URL.',
    );
  }

  return API_BASE_URL.replace(/\/+$/, '');
}

function buildApiUrl(endpoint: string): string {
  return `${getApiBaseUrl()}/${endpoint.replace(/^\/+/, '')}`;
}

interface ApiClientOptions extends RequestInit {
  auth?: boolean;
  retry?: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = TokenStorage.getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  const response = await fetch(buildApiUrl(API_ENDPOINTS.AUTH_REFRESH), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    TokenStorage.clearTokens();
    return false;
  }

  const data = (await response.json()) as RefreshTokenResponse;

  TokenStorage.setTokens(data.accessToken, data.refreshToken);

  return true;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { auth = true, retry = true, headers, ...rest } = options;

  const accessToken = TokenStorage.getAccessToken();

  const response = await fetch(buildApiUrl(endpoint), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 && auth && retry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiClient<T>(endpoint, {
        ...options,
        retry: false,
      });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    throw new ApiError(
      errorBody?.message || 'Não foi possível completar a requisição.',
      response.status,
      errorBody,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
