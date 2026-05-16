import { act, renderHook, waitFor } from '@testing-library/react';
import { usePublicCompanies } from './use-public-companies';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';

describe('usePublicCompanies', () => {
  beforeEach(() => {
    resetMockDb();
  });

  it('lista empresas públicas', async () => {
    const { result } = renderHook(() => usePublicCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toHaveLength(1);
    expect(result.current.companies[0].tradeName).toBe('Smart Fit');
  });

  it('loading', () => {
    const { result } = renderHook(() => usePublicCompanies());

    expect(result.current.isLoading).toBe(true);
  });

  it('erro', async () => {
    mockDb.company.publicStatus = 500;

    const { result } = renderHook(() => usePublicCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Não foi possível carregar as empresas.');
  });

  it('refetch', async () => {
    const { result } = renderHook(() => usePublicCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.company.publicList.push({
      ...mockDb.company.publicList[0],
      _id: 'company-2',
      slug: 'blue-fit',
      tradeName: 'Blue Fit',
      contacts: {
        ...mockDb.company.publicList[0].contacts,
        website: 'https://bluefitacademia.com.br/',
      },
      media: {
        logoUrl: '/images/logo/bluefit.svg',
      },
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.companies).toHaveLength(2);
  });

  it('deduplica empresas da mesma marca com nomes de unidades diferentes', async () => {
    mockDb.company.publicList = [
      {
        ...mockDb.company.publicList[0],
        _id: 'company-1',
        slug: 'blue-fit',
        tradeName: 'Blue Fit',
        contacts: {
          ...mockDb.company.publicList[0].contacts,
          website: 'https://bluefitacademia.com.br/',
        },
        media: {
          logoUrl: '/images/logo/bluefit.svg',
        },
      },
      {
        ...mockDb.company.publicList[0],
        _id: 'company-2',
        slug: 'bluefit-salvador',
        tradeName: 'Bluefit Salvador',
        contacts: {
          ...mockDb.company.publicList[0].contacts,
          website: 'https://bluefitacademia.com.br/',
        },
        media: {
          logoUrl: '/images/logo/bluefit.svg',
        },
      },
      {
        ...mockDb.company.publicList[0],
        _id: 'company-3',
        slug: 'bluefit-santos',
        tradeName: 'Bluefit Santos',
        contacts: {
          ...mockDb.company.publicList[0].contacts,
          website: 'https://bluefitacademia.com.br/',
        },
        media: {
          logoUrl: '/images/logo/bluefit.svg',
        },
      },
      {
        ...mockDb.company.publicList[0],
        _id: 'company-4',
        slug: 'smart-fit',
        tradeName: 'Smart Fit',
        contacts: {
          ...mockDb.company.publicList[0].contacts,
          website: 'https://smartfit.com.br/',
        },
        media: {
          logoUrl: '/images/logo/smartfit.svg',
        },
      },
    ];

    const { result } = renderHook(() => usePublicCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toHaveLength(2);
    expect(result.current.companies.map((company) => company.tradeName)).toEqual([
      'Blue Fit',
      'Smart Fit',
    ]);
  });
});
