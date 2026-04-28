'use client';

import { useEffect, useReducer } from 'react';
import ApplyEntity from '@/types/entities/apply.entity';
import { ApplyService } from '@/services/apply/apply.service';

interface UseJobApplicationsState {
  applications: ApplyEntity[];
  isLoading: boolean;
  error: string | null;
}

type UseJobApplicationsAction =
  | { type: 'fetch:start' }
  | { type: 'fetch:success'; applications: ApplyEntity[] }
  | { type: 'fetch:error'; message: string }
  | { type: 'fetch:reset' };

const initialState: UseJobApplicationsState = {
  applications: [],
  isLoading: true,
  error: null,
};

function jobApplicationsReducer(
  state: UseJobApplicationsState,
  action: UseJobApplicationsAction
): UseJobApplicationsState {
  switch (action.type) {
    case 'fetch:start':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'fetch:success':
      return {
        applications: action.applications,
        isLoading: false,
        error: null,
      };
    case 'fetch:error':
      return {
        applications: [],
        isLoading: false,
        error: action.message,
      };
    case 'fetch:reset':
      return {
        applications: [],
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

async function loadJobApplications(
  jobId: string,
  dispatch: React.ActionDispatch<[action: UseJobApplicationsAction]>
) {
  if (!jobId) {
    dispatch({ type: 'fetch:reset' });
    return;
  }

  dispatch({ type: 'fetch:start' });

  try {
    const response = await ApplyService.listByJob(jobId);

    dispatch({ type: 'fetch:success', applications: response });
  } catch {
    dispatch({
      type: 'fetch:error',
      message: 'Não foi possível carregar as aplicações da vaga.',
    });
  }
}

export function useJobApplications(jobId: string) {
  const [state, dispatch] = useReducer(jobApplicationsReducer, initialState);

  async function fetchApplications() {
    await loadJobApplications(jobId, dispatch);
  }

  useEffect(() => {
    void loadJobApplications(jobId, dispatch);
  }, [jobId]);

  return {
    ...state,
    refetch: fetchApplications,
  };
}
