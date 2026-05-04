'use client';

import { useState } from 'react';
import { ApiError } from '@/services/http/api-error';

interface CompanyByCnpjData {
  legalName: string;
  tradeName: string;
}

interface BrasilApiCompanyByCnpjResponse {
  razao_social?: string;
  nome_fantasia?: string;
}

function normalizeCnpj(cnpj: string) {
  return cnpj.replace(/\D/g, '');
}

export function useCompanyByCnpj() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchCompanyByCnpj(cnpj: string): Promise<CompanyByCnpjData | null> {
    const normalizedCnpj = normalizeCnpj(cnpj);

    if (normalizedCnpj.length !== 14) {
      setError(null);
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${normalizedCnpj}`
      );

      if (!response.ok) {
        throw new ApiError(
          'Não foi possível consultar o CNPJ.',
          response.status
        );
      }

      const data = (await response.json()) as BrasilApiCompanyByCnpjResponse;

      return {
        legalName: data.razao_social || '',
        tradeName: data.nome_fantasia || '',
      };
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível consultar o CNPJ.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    searchCompanyByCnpj,
    clearError,
    isLoading,
    error,
  };
}
