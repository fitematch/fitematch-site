import { act, renderHook, waitFor } from '@testing-library/react';
import { useCountryDialCodes } from './use-country-dial-codes';

describe('useCountryDialCodes', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('carrega países com sucesso', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => [
        {
          isoCode: 'BR',
          name: 'Brasil',
          dialCode: '+55',
          flag: '🇧🇷',
          mask: '(##) #####-####',
        },
        {
          isoCode: 'US',
          name: 'Estados Unidos',
          dialCode: '+1',
          flag: '🇺🇸',
          mask: '(###) ###-####',
        },
      ],
    })) as unknown as typeof fetch;

    const { result } = renderHook(() => useCountryDialCodes());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.defaultCountry.dialCode).toBe('+55');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.countries).toHaveLength(2);
    expect(result.current.countries[1].dialCode).toBe('+1');
  });

  it('mantém fallback quando response não é ok', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      json: async () => null,
    })) as unknown as typeof fetch;

    const { result } = renderHook(() => useCountryDialCodes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([result.current.defaultCountry]);
    expect(result.current.error).toBe('Não foi possível carregar a lista de países.');
  });

  it('mantém fallback quando fetch falha', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('network error');
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useCountryDialCodes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([result.current.defaultCountry]);
    expect(result.current.error).toBe('Não foi possível carregar a lista de países.');
  });

  it('refetch atualiza a lista novamente', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            isoCode: 'BR',
            name: 'Brasil',
            dialCode: '+55',
            flag: '🇧🇷',
            mask: '(##) #####-####',
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            isoCode: 'BR',
            name: 'Brasil',
            dialCode: '+55',
            flag: '🇧🇷',
            mask: '(##) #####-####',
          },
          {
            isoCode: 'AR',
            name: 'Argentina',
            dialCode: '+54',
            flag: '🇦🇷',
            mask: '(##) ####-####',
          },
        ],
      });

    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useCountryDialCodes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.countries).toHaveLength(2);
    expect(result.current.countries[1].dialCode).toBe('+54');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
