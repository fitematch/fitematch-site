'use client';

import { useEffect, useState } from 'react';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

interface UseRecruiterJobsHandlers {
  setJobs: React.Dispatch<React.SetStateAction<JobEntity[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadRecruiterJobs(handlers: UseRecruiterJobsHandlers) {
  const { setJobs, setIsLoading, setError } = handlers;

  try {
    setIsLoading(true);

    const response = await JobService.listMine();

    setJobs(response);
    setError(null);
  } catch {
    setError('Não foi possível carregar suas vagas.');
  } finally {
    setIsLoading(false);
  }
}

export function useRecruiterJobs() {
  const [jobs, setJobs] = useState<JobEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchJobs() {
    await loadRecruiterJobs({
      setJobs,
      setIsLoading,
      setError,
    });
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadRecruiterJobs({
        setJobs,
        setIsLoading,
        setError,
      });
    });
  }, []);

  return {
    jobs,
    isLoading,
    error,
    refetch: fetchJobs,
  };
}
