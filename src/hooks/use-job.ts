'use client';

import { useEffect, useState } from 'react';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

interface UseJobHandlers {
  setJob: React.Dispatch<React.SetStateAction<JobEntity | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadJob(jobId: string | undefined, handlers: UseJobHandlers) {
  const { setJob, setIsLoading, setError } = handlers;

  if (!jobId) {
    setIsLoading(false);
    return;
  }

  try {
    setIsLoading(true);

    const response = await JobService.read(jobId);

    setJob(response);
    setError(null);
  } catch {
    setError('Não foi possível carregar os dados da vaga.');
  } finally {
    setIsLoading(false);
  }
}

export function useJob(jobId?: string) {
  const [job, setJob] = useState<JobEntity | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(jobId));
  const [error, setError] = useState<string | null>(null);

  async function fetchJob() {
    await loadJob(jobId, {
      setJob,
      setIsLoading,
      setError,
    });
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadJob(jobId, {
        setJob,
        setIsLoading,
        setError,
      });
    });
  }, [jobId]);

  return {
    job,
    isLoading,
    error,
    refetch: fetchJob,
  };
}
