'use client';

import { useEffect, useState } from 'react';
import ApplyEntity from '@/types/entities/apply.entity';
import { ApplyService } from '@/services/apply/apply.service';

interface UseJobApplicationsHandlers {
  setApplications: React.Dispatch<React.SetStateAction<ApplyEntity[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadJobApplications(
  jobId: string | undefined,
  handlers: UseJobApplicationsHandlers
) {
  const { setApplications, setIsLoading, setError } = handlers;

  if (!jobId) {
    setIsLoading(false);
    return;
  }

  try {
    setIsLoading(true);

    const response = await ApplyService.listByJob(jobId);

    setApplications(response);
    setError(null);
  } catch {
    setError('Não foi possível carregar as candidaturas da vaga.');
  } finally {
    setIsLoading(false);
  }
}

export function useJobApplications(jobId?: string) {
  const [applications, setApplications] = useState<ApplyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(jobId));
  const [error, setError] = useState<string | null>(null);

  async function fetchApplications() {
    await loadJobApplications(jobId, {
      setApplications,
      setIsLoading,
      setError,
    });
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadJobApplications(jobId, {
        setApplications,
        setIsLoading,
        setError,
      });
    });
  }, [jobId]);

  return {
    applications,
    isLoading,
    error,
    refetch: fetchApplications,
  };
}
