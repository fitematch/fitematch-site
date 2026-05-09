'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CircleCheckBig, FileText, GraduationCap, Users, X, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { PaginationBox } from '@/components/ui/pagination-box';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobApplications } from '@/hooks/use-job-applications';
import { ApplyService } from '@/services/apply/apply.service';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ApplicationStatusEnum } from '@/types/entities/apply.entity';
import { resolveFileUrl } from '@/utils/file-url';

interface RecruiterJobApplicationsListProps {
  jobId: string;
  jobTitle?: string;
}

function getApplicationStatusLabel(status: ApplicationStatusEnum) {
  return {
    [ApplicationStatusEnum.APPLIED]: 'APLICADO',
    [ApplicationStatusEnum.SHORTLISTED]: 'PRÉ-SELECIONADO',
    [ApplicationStatusEnum.REJECTED]: 'REJEITADO',
    [ApplicationStatusEnum.HIRED]: 'CONTRATADO',
  }[status];
}

function getApplicationStatusTone(status: ApplicationStatusEnum) {
  if (status === ApplicationStatusEnum.HIRED) {
    return 'border-lime-500/20 bg-lime-500/10 text-lime-300';
  }

  if (status === ApplicationStatusEnum.REJECTED) {
    return 'border-red-500/20 bg-red-500/10 text-red-200';
  }

  if (status === ApplicationStatusEnum.SHORTLISTED) {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
  }

  return 'border-zinc-800 bg-black/40 text-zinc-300';
}

function formatAge(birthday?: string) {
  if (!birthday) {
    return 'Idade não informada';
  }

  const today = new Date();
  const birthDate = new Date(`${birthday}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return 'Idade não informada';
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  const currentYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  if (today < currentYearBirthday) {
    years -= 1;
  }

  return `${years} anos`;
}

function formatAppliedAt(value?: string | Date) {
  if (!value) {
    return 'Sem registro';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sem registro';
  }

  const datePart = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} - ${timePart}`;
}

function SummaryCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-7 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      </div>
      <p className="mt-7 text-5xl font-semibold tracking-[-0.06em] text-lime-400">{value}</p>
      <p className="mt-3 text-base font-medium leading-6 text-zinc-100">{helper}</p>
    </motion.div>
  );
}

export function RecruiterJobApplicationsList({
  jobId,
  jobTitle,
}: RecruiterJobApplicationsListProps) {
  const { applications, isLoading, error, refetch } = useJobApplications(jobId);
  const { showSuccess, showError } = useFlashMessage();
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | null>(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState<string>('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(
      (application) => application.status === ApplicationStatusEnum.APPLIED,
    ).length;
    const shortlisted = applications.filter(
      (application) => application.status === ApplicationStatusEnum.SHORTLISTED,
    ).length;
    const closed = applications.filter(
      (application) =>
        application.status === ApplicationStatusEnum.REJECTED ||
        application.status === ApplicationStatusEnum.HIRED,
    ).length;

    return { total, applied, shortlisted, closed };
  }, [applications]);

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paginatedApplications = applications.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  async function handleUpdateStatus(applyId: string, status: ApplicationStatusEnum) {
    try {
      await ApplyService.updateStatus(applyId, { status });
      showSuccess('Status da candidatura atualizado com sucesso.');
      await refetch();
    } catch {
      showError('Não foi possível atualizar o status da candidatura.');
    }
  }

  function handleOpenResumePreview(resumeUrl?: string, candidateName?: string) {
    if (!resumeUrl) {
      return;
    }

    setSelectedResumeUrl(resolveFileUrl(resumeUrl));
    setSelectedCandidateName(candidateName || 'Candidato');
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-44 rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))
        ) : (
          <>
            <SummaryCard
              label="Candidaturas"
              value={String(stats.total)}
              helper={jobTitle ? `Total para ${jobTitle}` : 'Fluxo total da vaga'}
              icon={<Users className="h-4 w-4" />}
            />
            <SummaryCard
              label="Ativas"
              value={String(stats.applied)}
              helper="Perfis aguardando triagem"
              icon={<Activity className="h-4 w-4" />}
            />
            <SummaryCard
              label="Pré Aprovações"
              value={String(stats.shortlisted)}
              helper="Candidatos pré aprovados"
              icon={<CircleCheckBig className="h-4 w-4" />}
            />
            <SummaryCard
              label="Encerradas"
              value={String(stats.closed)}
              helper="Contratados ou rejeitados"
              icon={<XCircle className="h-4 w-4" />}
            />
          </>
        )}
      </section>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
          <EmptyState
            message={
              jobTitle
                ? `A vaga ${jobTitle} ainda não possui candidaturas.`
                : 'Esta vaga ainda não possui candidaturas.'
            }
          />
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur lg:block">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
              <div>
                <h2 className="mt-1 text-xl font-semibold text-zinc-50 uppercase">
                  Candidatos para {jobTitle || 'esta vaga'}
                </h2>
              </div>
            </div>

            <table className="min-w-full divide-y divide-zinc-800 text-left">
              <thead className="bg-black/30">
                <tr className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  <th className="px-6 py-4 font-medium">Candidato</th>
                  <th className="px-6 py-4 font-medium">Idade</th>
                  <th className="px-6 py-4 font-medium">Currículo</th>
                  <th className="px-6 py-4 font-medium">Aplicado em</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {paginatedApplications.map((application) => (
                  <tr key={application._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-medium text-zinc-100">
                          {application.user?.name || application.userId}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {formatAge(application.user?.birthday)}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {application.user?.resumeUrl ? (
                        <Button
                          type="button"
                          variant="profile"
                          icon={<FileText className="h-4 w-4" />}
                          className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                          onClick={() =>
                            handleOpenResumePreview(
                              application.user?.resumeUrl,
                              application.user?.name || application.userId,
                            )
                          }
                        >
                          Ver currículo
                        </Button>
                      ) : (
                        <span className="text-sm text-zinc-500">Não enviado</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {formatAppliedAt(application.createdAt)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${getApplicationStatusTone(application.status)}`}
                      >
                        {getApplicationStatusLabel(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <div className="relative">
                          <select
                            value={application.status}
                            className="h-11 rounded-xl border border-zinc-800 bg-black/40 px-4 text-sm text-zinc-200 outline-none transition focus:border-lime-500/20"
                            onChange={(event) =>
                              void handleUpdateStatus(
                                application._id,
                                event.target.value as ApplicationStatusEnum,
                              )
                            }
                          >
                            {Object.values(ApplicationStatusEnum).map((status) => (
                              <option key={status} value={status}>
                                {getApplicationStatusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {paginatedApplications.map((application, index) => (
              <motion.article
                key={application._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.04 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        {application.user?.name || application.userId}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {formatAge(application.user?.birthday)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${getApplicationStatusTone(application.status)}`}
                    >
                      {getApplicationStatusLabel(application.status)}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Aplicado em
                      </p>
                      <p className="mt-2 text-sm text-zinc-200">
                        {formatAppliedAt(application.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Formação</p>
                      <p className="mt-2 text-sm text-zinc-200">Currículo e perfil</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Pipeline</p>
                      <p className="mt-2 text-sm text-zinc-200">Triagem e atualização</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {application.user?.resumeUrl && (
                      <Button
                        type="button"
                        variant="profile"
                        icon={<GraduationCap className="h-4 w-4" />}
                        className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                        onClick={() =>
                          handleOpenResumePreview(
                            application.user?.resumeUrl,
                            application.user?.name || application.userId,
                          )
                        }
                      >
                        Ver currículo
                      </Button>
                    )}
                    <select
                      value={application.status}
                      className="h-11 rounded-xl border border-zinc-800 bg-black/40 px-4 text-sm text-zinc-200 outline-none transition focus:border-lime-500/20"
                      onChange={(event) =>
                        void handleUpdateStatus(
                          application._id,
                          event.target.value as ApplicationStatusEnum,
                        )
                      }
                    >
                      {Object.values(ApplicationStatusEnum).map((status) => (
                        <option key={status} value={status}>
                          {getApplicationStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <PaginationBox currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={Boolean(selectedResumeUrl)}
        onClose={() => setSelectedResumeUrl(null)}
        contentClassName="max-w-6xl border-zinc-800 bg-zinc-950/95"
        showDefaultClose={false}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">
                Currículo de {selectedCandidateName}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Preview do arquivo enviado pelo candidato.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedResumeUrl(null)}
              className="text-zinc-400 transition hover:text-zinc-100"
              aria-label="Fechar preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {selectedResumeUrl && (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-white">
              <iframe
                src={selectedResumeUrl}
                title={`Currículo de ${selectedCandidateName}`}
                className="h-[75vh] w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            {selectedResumeUrl && (
              <a
                href={selectedResumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/40 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.03]"
              >
                <FileText className="h-4 w-4" />
                Abrir em nova aba
              </a>
            )}

            <button
              type="button"
              onClick={() => setSelectedResumeUrl(null)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/40 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.03]"
            >
              <X className="h-4 w-4" />
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
