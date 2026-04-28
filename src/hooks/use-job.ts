'use client';

import { useEffect, useState } from 'react';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

export function useJob(jobId: string) {
  const [job, setJob] = useState<JobEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    async function fetchJob() {
      try {
        const data = await JobService.read(jobId);

        setJob(data);
        setError(null);
      } catch {
        setError('Não foi possível carregar a vaga.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  return { job, isLoading, error };
}
