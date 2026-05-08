'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useRecruiterJobs } from '@/hooks/use-recruiter-jobs';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

export function RecruiterJobsList() {
  const { jobs, isLoading, error, refetch } = useRecruiterJobs();
  const { showSuccess, showError } = useFlashMessage();
  const [jobToDelete, setJobToDelete] = useState<JobEntity | null>(null);

  async function handleDelete(jobId: string) {
    try {
      await JobService.deleteMine(jobId);
      showSuccess('Vaga removida com sucesso.');
      setJobToDelete(null);
      await refetch();
    } catch {
      showError('Não foi possível remover a vaga.');
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 text-zinc-400 backdrop-blur">
        Carregando vagas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 text-zinc-500 backdrop-blur">
        Você ainda não publicou nenhuma vaga.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job, index) => {
        const jobId = job._id || (job as { id?: string }).id;

        return (
          <article
            key={jobId || job.slug || `${job.title}-${index}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:border-lime-500/25 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.06),0_18px_60px_rgba(0,0,0,0.32),0_0_28px_rgba(34,197,94,0.06)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">{job.title}</h2>

                <p className="mt-2 text-sm text-zinc-500">{job.description}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span>Status: {job.status}</span>
                  <span>Tipo: {job.contractType}</span>
                  <span>Vagas: {job.slots}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {jobId && (
                  <Link href={ROUTES.RECRUITER_EDIT_JOB(jobId)}>
                    <Button variant="profile" icon={<FaEdit />}>
                      Editar
                    </Button>
                  </Link>
                )}

                {jobId && (
                  <Link href={ROUTES.RECRUITER_JOB_APPLICATIONS(jobId)}>
                    <Button variant="login" icon={<FaUsers />}>
                      Candidatos
                    </Button>
                  </Link>
                )}

                <Button
                  type="button"
                  variant="danger"
                  icon={<FaTrash />}
                  onClick={() => {
                    if (jobId) {
                      setJobToDelete(job);
                    }
                  }}
                  disabled={!jobId}
                >
                  Remover
                </Button>
              </div>
            </div>
          </article>
        );
      })}

      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-zinc-100">
                <FaTrash className="h-5 w-5 shrink-0" />
                <h2>APAGAR VAGA</h2>
              </div>
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="text-2xl leading-none text-zinc-400 transition-colors hover:text-zinc-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-zinc-300">Confirme a exclusão da vaga abaixo.</p>

              <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-black/50 p-6 md:grid-cols-2">
                <div>
                  <label className="text-sm text-zinc-400">Título</label>
                  <input
                    value={jobToDelete.title}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Tipo de contrato</label>
                  <input
                    value={jobToDelete.contractType || ''}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Status</label>
                  <input
                    value={jobToDelete.status}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Vagas</label>
                  <input
                    value={String(jobToDelete.slots)}
                    disabled
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 opacity-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="profile" onClick={() => setJobToDelete(null)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaTrash />}
                  onClick={() => {
                    const jobId = jobToDelete._id || (jobToDelete as { id?: string }).id;

                    if (jobId) {
                      void handleDelete(jobId);
                    }
                  }}
                >
                  Apagar Vaga
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
