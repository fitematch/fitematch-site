import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthSessions } from './use-auth-sessions';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';
import { STORAGE_KEYS } from '@/constants/storage-keys';

describe('useAuthSessions', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    resetMockDb();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('lista sessões', async () => {
    const { result } = renderHook(() => useAuthSessions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].id).toBe('session-1');
  });

  it('revoke session', async () => {
    const { result } = renderHook(() => useAuthSessions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.revokeSession('session-1');
    });

    expect(result.current.sessions).toEqual([]);
  });

  it('erro', async () => {
    mockDb.auth.sessionsStatus = 500;

    const { result } = renderHook(() => useAuthSessions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Não foi possível carregar suas sessões.');
  });
});
