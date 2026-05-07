import { act, renderHook, waitFor } from '@testing-library/react';
import { useApplication, useApplications } from './use-applications';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';
import { ApplyService } from '@/services/apply/apply.service';
import { STORAGE_KEYS } from '@/constants/storage-keys';

describe('useApplications', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    resetMockDb();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('loading inicial', () => {
    const { result } = renderHook(() => useApplications());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasLoaded).toBe(false);
  });

  it('lista aplicações', async () => {
    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications).toHaveLength(1);
    expect(result.current.applications[0]._id).toBe('apply-1');
  });

  it('empty state', async () => {
    mockDb.apply.mine = [];

    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('erro', async () => {
    mockDb.apply.listStatus = 500;

    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Não foi possível carregar suas candidaturas.');
  });

  it('refetch', async () => {
    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.apply.mine.push({
      _id: 'apply-2',
      jobId: 'job-2',
      userId: 'user-1',
      user: {
        name: 'Novo Candidato',
        birthday: '1990-01-01',
        resumeUrl: '/uploads/resumes/user-1/resume-2.pdf',
      },
      status: 'applied' as never,
      createdAt: '2026-05-04T10:00:00.000Z',
      updatedAt: '2026-05-04T10:00:00.000Z',
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.applications).toHaveLength(2);
  });

  it('delete application', async () => {
    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await ApplyService.delete('apply-1');
      await result.current.refetch();
    });

    expect(result.current.applications).toEqual([]);
  });

  it('mantém estado desabilitado quando enabled é false', async () => {
    const { result } = renderHook(() => useApplications({ enabled: false }));

    expect(result.current.applications).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasLoaded).toBe(true);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.applications).toEqual([]);
  });

  it('ordena aplicações pela data mais recente', async () => {
    mockDb.apply.mine = [
      {
        _id: 'apply-old',
        jobId: 'job-1',
        userId: 'user-1',
        user: {
          name: 'Antigo',
          birthday: '1990-01-01',
          resumeUrl: '/uploads/resumes/user-1/old.pdf',
        },
        status: 'applied' as never,
        createdAt: '2026-05-01T10:00:00.000Z',
        updatedAt: '2026-05-01T10:00:00.000Z',
      },
      {
        _id: 'apply-new',
        jobId: 'job-2',
        userId: 'user-1',
        user: {
          name: 'Recente',
          birthday: '1991-01-01',
          resumeUrl: '/uploads/resumes/user-1/new.pdf',
        },
        status: 'applied' as never,
        createdAt: '2026-05-05T10:00:00.000Z',
        updatedAt: '2026-05-05T10:00:00.000Z',
      },
      {
        _id: 'apply-no-date',
        jobId: 'job-3',
        userId: 'user-1',
        user: {
          name: 'Sem Data',
          birthday: '1992-01-01',
          resumeUrl: '/uploads/resumes/user-1/no-date.pdf',
        },
        status: 'applied' as never,
        createdAt: undefined as never,
        updatedAt: '2026-05-02T10:00:00.000Z',
      },
    ];

    const { result } = renderHook(() => useApplications());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.applications.map((application) => application._id)).toEqual([
      'apply-new',
      'apply-old',
      'apply-no-date',
    ]);
  });
});

describe('useApplication', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
    resetMockDb();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('carrega candidatura individual', async () => {
    const { result } = renderHook(() => useApplication('apply-1'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.application?._id).toBe('apply-1');
    expect(result.current.error).toBeNull();
    expect(result.current.hasLoaded).toBe(true);
  });

  it('mantém estado inicial quando não recebe applyId', async () => {
    const { result } = renderHook(() => useApplication());

    expect(result.current.application).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasLoaded).toBe(false);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.application).toBeNull();
  });

  it('mostra erro quando falha ao buscar candidatura', async () => {
    const { result } = renderHook(() => useApplication('apply-inexistente'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.application).toBeNull();
    expect(result.current.error).toBe(
      'Não foi possível carregar os dados da candidatura.'
    );
    expect(result.current.hasLoaded).toBe(true);
  });

  it('refetch recarrega candidatura individual', async () => {
    const { result } = renderHook(() => useApplication('apply-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockDb.apply.mine[0] = {
      ...mockDb.apply.mine[0],
      status: 'shortlisted' as never,
    };

    await act(async () => {
      await result.current.loadApplication();
    });

    expect(result.current.application?.status).toBe('shortlisted');
  });
});
