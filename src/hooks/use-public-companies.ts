'use client';

import { useCallback, useEffect, useState } from 'react';
import { CompanyService } from '@/services/company/company.service';
import { PublicCompanyResponse } from '@/services/company/company.types';

export function usePublicCompanies() {
  const [companies, setCompanies] = useState<PublicCompanyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await CompanyService.listPublic();

      setCompanies(response);
      setError(null);
    } catch {
      setError('Não foi possível carregar as empresas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCompanies();
    });
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    error,
    refetch: fetchCompanies,
  };
}
