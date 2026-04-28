'use client';

import { useEffect, useReducer } from 'react';
import { JobEntity } from '@/types/entities/job.entity';
import { JobService } from '@/services/job/job.service';

interface UseRecruiterJobsState {
  jobs: JobEntity[];
  isLoading: boolean;
  error: string | null;
}

type UseRecruiterJobsAction =
  | { type: 'fetch:start' }
  | { type: 'fetch:success'; jobs: JobEntity[] }
  | { type: 'fetch:error'; message: string };

const initialState: UseRecruiterJobsState = {
  jobs: [],
  isLoading: true,
  error: null,
};

function recruiterJobsReducer(
  state: UseRecruiterJobsState,
  action: UseRecruiterJobsAction
): UseRecruiterJobsState {
  switch (action.type) {
    case 'fetch:start':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'fetch:success':
      return {
        jobs: action.jobs,
        isLoading: false,
        error: null,
      };
    case 'fetch:error':
      return {
        jobs: [],
        isLoading: false,
        error: action.message,
      };
    default:
      return state;
  }
}

export function useRecruiterJobs() {
  const [state, dispatch] = useReducer(recruiterJobsReducer, initialState);

  async function fetchJobs() {
    dispatch({ type: 'fetch:start' });

    try {
      const response = await JobService.listMine();

      dispatch({ type: 'fetch:success', jobs: response });
    } catch {
      dispatch({
        type: 'fetch:error',
        message: 'Não foi possível carregar suas vagas.',
      });
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    ...state,
    refetch: fetchJobs,
  };
}
