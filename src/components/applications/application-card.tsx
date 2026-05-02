'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity from '@/types/entities/apply.entity';
import { useFlashMessage } from '@/contexts/flash-message-context';

interface Props {
  application: ApplyEntity;
  onDeleted?: () => void;
}

export function ApplicationCard({ application, onDeleted }: Props) {
  const { showSuccess, showError } = useFlashMessage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const statusLabel =
    application.status === 'applied' ? 'Aplicado' : application.status;

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await ApplyService.delete(application._id);

      showSuccess('Candidatura cancelada com sucesso.');
      onDeleted?.();
    } catch {
      showError('Erro ao cancelar candidatura.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="rounded-2xl border border-gray-300 bg-black p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="md:col-start-1">
          <p className="text-sm text-gray-400">Vaga</p>
          <h2 className="text-lg font-semibold text-gray-100">
            {application.jobId}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Status: {statusLabel}
          </p>
        </div>

        <div className="flex justify-end md:col-start-1">
          <Button
            variant="danger"
            icon={<FaTrash />}
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={isDeleting}
          >
            Cancelar Candidatura
          </Button>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <FaTrash className="h-5 w-5 shrink-0" />
                <h2>Cancelar Aplicação</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Confirme a exclusão da aplicação abaixo.
              </p>

              <div className="grid gap-4 rounded-2xl border border-gray-500 bg-black p-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-300">Vaga</p>
                  <div className="rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-100">
                    {application.jobId}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-300">Status</p>
                  <div className="rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-100">
                    {statusLabel}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="profile"
                  onClick={() => setIsConfirmModalOpen(false)}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaTrash />}
                  onClick={async () => {
                    await handleDelete();
                    setIsConfirmModalOpen(false);
                  }}
                  disabled={isDeleting}
                >
                  Confirmar Cancelamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
