'use client';

import { useEffect, useState } from 'react';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

interface UseJobsState {
  jobs: JobEntity[];
  isLoading: boolean;
  error: string | null;
}

export function useJobs() {
  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobs = await JobService.list();

        setState({
          jobs,
          isLoading: false,
          error: null,
        });
      } catch {
        setState({
          jobs: [],
          isLoading: false,
          error: 'Não foi possível carregar as vagas.',
        });
      }
    }

    fetchJobs();
  }, []);

  return state;
}
