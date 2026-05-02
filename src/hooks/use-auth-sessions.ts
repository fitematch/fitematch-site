'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/services/auth/auth.service';
import { AuthSessionResponse } from '@/services/auth/auth.types';

interface UseAuthSessionsHandlers {
  setSessions: React.Dispatch<React.SetStateAction<AuthSessionResponse[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadSessions(handlers: UseAuthSessionsHandlers) {
  const { setSessions, setIsLoading, setError } = handlers;

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

export function useAuthSessions() {
  const [sessions, setSessions] = useState<AuthSessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSessions() {
    await loadSessions({
      setSessions,
      setIsLoading,
      setError,
    });
  }

  async function revokeSession(sessionId: string) {
    await AuthService.revokeSession(sessionId);
    await fetchSessions();
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadSessions({
        setSessions,
        setIsLoading,
        setError,
      });
    });
  }, []);

  return {
    sessions,
    isLoading,
    error,
    refetch: fetchSessions,
    revokeSession,
  };
}
