'use client';

import { useEffect, useState } from 'react';
import { JobService } from '@/services/job/job.service';
import { JobEntity, JobStatusEnum } from '@/types/entities/job.entity';

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

  async function loadJobs() {
    const jobs = await JobService.list();
    return jobs.filter((job) => job.status === JobStatusEnum.ACTIVE);
  }

  async function fetchJobs() {
    setState((current) => ({
      ...current,
      isLoading: true,
    }));

    try {
      const activeJobs = await loadJobs();

      setState({
        jobs: activeJobs,
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

  useEffect(() => {
    let isMounted = true;

    async function initializeJobs() {
      try {
        const activeJobs = await loadJobs();

        if (!isMounted) {
          return;
        }

        setState({
          jobs: activeJobs,
          isLoading: false,
          error: null,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          jobs: [],
          isLoading: false,
          error: 'Não foi possível carregar as vagas.',
        });
      }
    }

    void initializeJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...state,
    refetch: fetchJobs,
  };
}
