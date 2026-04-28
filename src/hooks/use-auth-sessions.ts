'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/services/auth/auth.service';
import { AuthSessionResponse } from '@/services/auth/auth.types';

export function useAuthSessions() {
  const [sessions, setSessions] = useState<AuthSessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSessions() {
    try {
      const response = await AuthService.listSessions();

      setSessions(response);
      setError(null);
    } catch {
      setError('Não foi possível carregar suas sessões.');
    } finally {
      setIsLoading(false);
    }
  }

  async function revokeSession(sessionId: string) {
    await AuthService.revokeSession(sessionId);
    await fetchSessions();
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    isLoading,
    error,
    refetch: fetchSessions,
    revokeSession,
  };
}
