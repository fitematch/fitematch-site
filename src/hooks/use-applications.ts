'use client';

import { useEffect, useState } from 'react';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity from '@/types/entities/apply.entity';

interface UseApplicationsHandlers {
  setApplications: React.Dispatch<React.SetStateAction<ApplyEntity[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadApplications(handlers: UseApplicationsHandlers) {
  const { setApplications, setIsLoading, setError } = handlers;

  try {
    setIsLoading(true);

    const response = await ApplyService.listMine();

    setApplications(response);
    setError(null);
  } catch {
    setError('Não foi possível carregar suas candidaturas.');
  } finally {
    setIsLoading(false);
  }
}

export function useApplications() {
  const [applications, setApplications] = useState<ApplyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchApplications() {
    await loadApplications({
      setApplications,
      setIsLoading,
      setError,
    });
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplications({
        setApplications,
        setIsLoading,
        setError,
      });
    });
  }, []);

  return {
    applications,
    isLoading,
    error,
    refetch: fetchApplications,
  };
}
