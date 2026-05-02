'use client';

import { useState } from 'react';
import { AddressService } from '@/services/address/address.service';

interface AddressByZipCodeData {
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function useAddressByZipCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchZipCode(zipCode: string): Promise<AddressByZipCodeData | null> {
    const normalizedZipCode = AddressService.normalizeZipCode(zipCode);

    if (normalizedZipCode.length !== 8) {
      setError(null);
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await AddressService.findByZipCode(normalizedZipCode);

      return {
        street: data.logradouro || '',
        complement: data.complemento || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      };
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível consultar o CEP.'
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
    searchZipCode,
    clearError,
    isLoading,
    error,
  };
}
