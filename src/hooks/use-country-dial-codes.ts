'use client';

import { useCallback, useEffect, useState } from 'react';
import { CountryDialCode } from '@/types/country-dial-code.types';

const DEFAULT_COUNTRY: CountryDialCode = {
  isoCode: 'BR',
  name: 'Brasil',
  dialCode: '+55',
  flag: '🇧🇷',
  mask: '(##) #####-####',
};

export function useCountryDialCodes() {
  const [countries, setCountries] = useState<CountryDialCode[]>([
    DEFAULT_COUNTRY,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/data/country-dial-codes.json');

      if (!response.ok) {
        throw new Error('Could not load country dial codes.');
      }

      const data = (await response.json()) as CountryDialCode[];

      setCountries(data);
      setError(null);
    } catch {
      setCountries([DEFAULT_COUNTRY]);
      setError('Não foi possível carregar a lista de países.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCountries();
    });
  }, [fetchCountries]);

  return {
    countries,
    defaultCountry: DEFAULT_COUNTRY,
    isLoading,
    error,
    refetch: fetchCountries,
  };
}
