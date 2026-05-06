'use client';

import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { VscFilePdf } from 'react-icons/vsc';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
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
    [ApplicationStatusEnum.APPLIED]: 'Aplicado',
    [ApplicationStatusEnum.SHORTLISTED]: 'Pré-selecionado',
    [ApplicationStatusEnum.REJECTED]: 'Rejeitado',
    [ApplicationStatusEnum.HIRED]: 'Contratado',
  }[status];
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

  const lastBirthday = new Date(
    today < currentYearBirthday ? today.getFullYear() - 1 : today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  const diffInMs = today.getTime() - lastBirthday.getTime();
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const dayLabel = days === 1 ? 'dia' : 'dias';

  return `${years} anos e ${days} ${dayLabel}`;
}

export function RecruiterJobApplicationsList({
  jobId,
  jobTitle,
}: RecruiterJobApplicationsListProps) {
  const { applications, isLoading, error, refetch } =
    useJobApplications(jobId);
  const { showSuccess, showError } = useFlashMessage();
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | null>(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState<string>('');

  async function handleUpdateStatus(
    applyId: string,
    status: ApplicationStatusEnum,
  ) {
    try {
      await ApplyService.updateStatus(applyId, {
        status,
      });

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

  if (isLoading) {
    return <p className="text-gray-700">Carregando candidaturas...</p>;
  }

  if (error) {
    return <p className="text-red-100">{error}</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-900 p-6 text-gray-700">
        {jobTitle
          ? `A vaga ${jobTitle} ainda não possui candidaturas.`
          : 'Esta vaga ainda não possui candidaturas.'}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <article
          key={application._id}
          className="rounded-2xl border border-gray-500 bg-black p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-gray-300">
                <FaUser />
                <span className="text-sm">
                  {'05/05/26 as 21:30'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
              </div>
              <h2 className="mt-3 text-xl font-semibold text-gray-100">
                {application.user?.name} ({formatAge(application.user?.birthday)})
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Status da aplicação: {getApplicationStatusLabel(application.status)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {application.user?.resumeUrl && (
                <Button
                  type="button"
                  variant="login"
                  icon={<VscFilePdf />}
                  className="h-[50px]"
                  onClick={() =>
                    handleOpenResumePreview(
                      application.user?.resumeUrl,
                      application.user?.name || application.userId,
                    )
                  }
                >
                  Ver Currículo
                </Button>
              )}
              <div className="relative">
                <select
                  defaultValue={application.status}
                  className="h-[50px] appearance-none rounded-md border border-gray-800 bg-black py-3 pr-12 pl-4 text-gray-100 outline-none transition focus:border-gray-600"
                  onChange={(event) =>
                    handleUpdateStatus(
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
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-300">
                  <MdKeyboardDoubleArrowDown className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}

      <Modal
        isOpen={Boolean(selectedResumeUrl)}
        onClose={() => setSelectedResumeUrl(null)}
        contentClassName="max-w-6xl"
        showDefaultClose={false}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-100">
                Currículo de {selectedCandidateName}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Preview do arquivo enviado pelo candidato.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedResumeUrl(null)}
              className="text-gray-300 transition hover:text-gray-100"
              aria-label="Fechar preview"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {selectedResumeUrl && (
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white">
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
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
              >
                <VscFilePdf className="h-4 w-4" />
                Abrir em nova aba
              </a>
            )}

            <button
              type="button"
              onClick={() => setSelectedResumeUrl(null)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
            >
              <FaTimes className="h-4 w-4" />
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
