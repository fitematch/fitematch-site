import { act, renderHook, waitFor } from '@testing-library/react';
import { useJobs } from './use-jobs';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';
import { JobStatusEnum } from '@/types/entities/job.entity';

describe('useJobs', () => {
  beforeEach(() => {
    resetMockDb();
  });

  it('lista jobs', async () => {
    const { result } = renderHook(() => useJobs());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toHaveLength(1);
    expect(result.current.jobs[0].status).toBe(JobStatusEnum.ACTIVE);
  });

  it('loading', () => {
    const { result } = renderHook(() => useJobs());

    expect(result.current.isLoading).toBe(true);
  });

  it('erro', async () => {
    mockDb.job.listStatus = 500;

    const { result } = renderHook(() => useJobs());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Não foi possível carregar as vagas.');
    expect(result.current.jobs).toEqual([]);
  });

  it('refetch', async () => {
    const { result } = renderHook(() => useJobs());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.job.list.push({
      ...mockDb.job.list[0],
      _id: 'job-2',
      slug: 'job-2',
      title: 'Professor de Natação',
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.jobs).toHaveLength(2);
  });
});
