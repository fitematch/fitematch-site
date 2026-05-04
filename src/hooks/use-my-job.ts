'use client';

import { useEffect, useState } from 'react';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

interface UseMyJobHandlers {
  setJob: React.Dispatch<React.SetStateAction<JobEntity | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadMyJob(jobId: string | undefined, handlers: UseMyJobHandlers) {
  const { setJob, setIsLoading, setError } = handlers;

  if (!jobId) {
    setIsLoading(false);
    return;
  }

  try {
    setIsLoading(true);

    const response = await JobService.listMine();
    const selectedJob =
      response.find(
        (item) => item._id === jobId || (item as { id?: string }).id === jobId
      ) || null;

    if (!selectedJob) {
      setError('Não foi possível carregar os dados da vaga.');
      setJob(null);
      return;
    }

    setJob(selectedJob);
    setError(null);
  } catch {
    setError('Não foi possível carregar os dados da vaga.');
  } finally {
    setIsLoading(false);
  }
}

export function useMyJob(jobId?: string) {
  const [job, setJob] = useState<JobEntity | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(jobId));
  const [error, setError] = useState<string | null>(null);

  async function fetchJob() {
    await loadMyJob(jobId, {
      setJob,
      setIsLoading,
      setError,
    });
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadMyJob(jobId, {
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
