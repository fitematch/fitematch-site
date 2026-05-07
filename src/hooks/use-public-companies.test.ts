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
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.companies).toHaveLength(2);
  });
});
