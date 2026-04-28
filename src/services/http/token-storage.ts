import { STORAGE_KEYS } from '@/constants/storage-keys';

export const TokenStorage = {
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};