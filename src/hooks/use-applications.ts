'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity from '@/types/entities/apply.entity';
import { ProductRoleEnum } from '@/types/entities/user.entity';

interface UseApplicationsHandlers {
  setApplications: React.Dispatch<React.SetStateAction<ApplyEntity[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface UseApplicationHandlers {
  setApplication: React.Dispatch<React.SetStateAction<ApplyEntity | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

async function loadApplications(handlers: UseApplicationsHandlers) {
  const { setApplications, setIsLoading, setError } = handlers;

  try {
    setIsLoading(true);

    const response = await ApplyService.listMine();

    setApplications(response);
    setError(null);
  } catch {
    setError('Não foi possível carregar suas candidaturas.');
  } finally {
    setIsLoading(false);
  }
}

async function loadApplication(
  applyId: string | undefined,
  handlers: UseApplicationHandlers,
) {
  const { setApplication, setIsLoading, setError } = handlers;

  if (!applyId) {
    setApplication(null);
    setIsLoading(false);
    setError(null);
    return;
  }

  try {
    setIsLoading(true);

    const response = await ApplyService.read(applyId);

    setApplication(response);
    setError(null);
  } catch {
    setError('Não foi possível carregar a candidatura.');
  } finally {
    setIsLoading(false);
  }
}

interface UseApplicationsOptions {
  enabled?: boolean;
}

export function useApplications(options: UseApplicationsOptions = {}) {
  const { enabled } = options;
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [applications, setApplications] = useState<ApplyEntity[]>([]);
  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;
  const isEnabled = enabled ?? (isAuthenticated && isCandidate);
  const [isLoading, setIsLoading] = useState(isAuthLoading || isEnabled);
  const [error, setError] = useState<string | null>(null);

  async function fetchApplications() {
    if (!isEnabled) {
      setApplications([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    await loadApplications({
      setApplications,
      setIsLoading,
      setError,
    });
  }

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isEnabled) {
      setApplications([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    queueMicrotask(() => {
      void loadApplications({
        setApplications,
        setIsLoading,
        setError,
      });
    });
  }, [isAuthLoading, isEnabled]);

  return {
    applications,
    isLoading: isAuthLoading || (isEnabled ? isLoading : false),
    error,
    refetch: fetchApplications,
  };
}

export function useApplication(applyId?: string) {
  const [application, setApplication] = useState<ApplyEntity | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(applyId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplication(applyId, {
        setApplication,
        setIsLoading,
        setError,
      });
    });
  }, [applyId]);

  return {
    application,
    isLoading,
    error,
  };
}
