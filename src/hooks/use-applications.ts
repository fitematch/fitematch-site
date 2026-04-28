'use client';

import { useEffect, useReducer } from 'react';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity from '@/types/entities/apply.entity';

interface UseApplicationsState {
  applications: ApplyEntity[];
  isLoading: boolean;
  error: string | null;
}

type UseApplicationsAction =
  | { type: 'fetch:start' }
  | { type: 'fetch:success'; applications: ApplyEntity[] }
  | { type: 'fetch:error'; message: string };

const initialState: UseApplicationsState = {
  applications: [],
  isLoading: true,
  error: null,
};

function applicationsReducer(
  state: UseApplicationsState,
  action: UseApplicationsAction
): UseApplicationsState {
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
    default:
      return state;
  }
}

export function useApplications() {
  const [state, dispatch] = useReducer(applicationsReducer, initialState);

  async function fetchApplications() {
    dispatch({ type: 'fetch:start' });

    try {
      const response = await ApplyService.listMine();

      dispatch({ type: 'fetch:success', applications: response });
    } catch {
      dispatch({
        type: 'fetch:error',
        message: 'Não foi possível carregar suas candidaturas.',
      });
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    ...state,
    refetch: fetchApplications,
  };
}
