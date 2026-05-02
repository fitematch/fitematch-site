'use client';

import { FaSave, FaUser } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/use-job-applications';
import { ApplyService } from '@/services/apply/apply.service';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ApplicationStatusEnum } from '@/types/entities/apply.entity';

interface RecruiterJobApplicationsListProps {
  jobId: string;
}

export function RecruiterJobApplicationsList({
  jobId,
}: RecruiterJobApplicationsListProps) {
  const { applications, isLoading, error, refetch } =
    useJobApplications(jobId);
  const { showSuccess, showError } = useFlashMessage();

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

  if (isLoading) {
    return <p className="text-gray-700">Carregando candidaturas...</p>;
  }

  if (error) {
    return <p className="text-red-100">{error}</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-900 p-6 text-gray-700">
        Esta vaga ainda não possui candidaturas.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <article
          key={application._id}
          className="rounded-2xl border border-gray-900 bg-black p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaUser />
                <span className="text-sm">Candidato</span>
              </div>

              <h2 className="mt-3 text-xl font-semibold text-gray-100">
                {application.userId}
              </h2>

              <p className="mt-2 text-sm text-gray-700">
                Status atual: {application.status}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                defaultValue={application.status}
                className="rounded-xl border border-gray-900 bg-black px-4 py-3 text-gray-100 outline-none"
                onChange={(event) =>
                  handleUpdateStatus(
                    application._id,
                    event.target.value as ApplicationStatusEnum,
                  )
                }
              >
                {Object.values(ApplicationStatusEnum).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <Button
                type="button"
                variant="profile"
                icon={<FaSave />}
                onClick={() => refetch()}
              >
                Atualizar lista
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
