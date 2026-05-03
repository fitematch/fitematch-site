'use client';

import { useCallback, useState } from 'react';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity from '@/types/entities/apply.entity';

interface UseApplicationsOptions {
  enabled?: boolean;
}

export function useApplications(options?: UseApplicationsOptions) {
  const isEnabled = options?.enabled ?? true;

  const [applications, setApplications] = useState<ApplyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!isEnabled) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await ApplyService.listMine();

      const sortedApplications = [...response].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      });

      setApplications(sortedApplications);
      setError(null);
      setHasLoaded(true);
    } catch {
      setError('Não foi possível carregar suas candidaturas.');
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled]);

  const loadApplications = useCallback(() => {
    void fetchApplications();
  }, [fetchApplications]);

  return {
    applications: isEnabled ? applications : [],
    isLoading: isEnabled ? isLoading : false,
    error: isEnabled ? error : null,
    hasLoaded: isEnabled ? hasLoaded : true,
    refetch: fetchApplications,
    loadApplications,
  };
}

export function useApplication(applyId?: string) {
  const [application, setApplication] = useState<ApplyEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    if (!applyId) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await ApplyService.read(applyId);

      setApplication(response);
      setError(null);
      setHasLoaded(true);
    } catch {
      setError('Não foi possível carregar os dados da candidatura.');
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [applyId]);

  const loadApplication = useCallback(() => {
    void fetchApplication();
  }, [fetchApplication]);

  return {
    application,
    isLoading,
    error,
    hasLoaded,
    refetch: fetchApplication,
    loadApplication,
  };
}
