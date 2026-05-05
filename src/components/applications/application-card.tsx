'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { ApplyService } from '@/services/apply/apply.service';
import ApplyEntity from '@/types/entities/apply.entity';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { CARD_STYLES } from '@/constants/styles';
import { resolveFileUrl } from '@/utils/file-url';

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
  const details = (application as ApplyEntity & {
    details?: {
      jobTitle?: string;
      tradeName?: string;
      logoUrl?: string;
    };
  }).details;
  const jobTitle = details?.jobTitle || 'Vaga sem título';
  const companyName = details?.tradeName || 'Empresa';
  const logoUrl = details?.logoUrl;
  const companyInitials = companyName.slice(0, 2).toUpperCase();
  const applyId = application._id || application.id || '';
  const appliedAt = application.createdAt
    ? new Date(application.createdAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await ApplyService.delete(applyId);

      showSuccess('Candidatura cancelada com sucesso.');
      onDeleted?.();
    } catch {
      showError('Erro ao cancelar candidatura.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className={`${CARD_STYLES.jobCard} relative overflow-hidden`}>
      <div className="absolute inset-0" />
      <div className="relative flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {logoUrl ? (
              <Image
                src={resolveFileUrl(logoUrl)}
                alt={companyName}
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 rounded-2xl border border-gray-700 bg-white/95 object-cover p-2 shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-700 bg-gray-950 text-sm font-semibold text-gray-200 shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
                {companyInitials}
              </div>
            )}

            <div className="min-w-0">
              <h2 className="mt-2 truncate text-xl font-bold text-gray-100">
                {jobTitle}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-300">
                <MdBusiness className="h-4 w-4 shrink-0 text-gray-500" />
                <span className="truncate">{companyName}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            {statusLabel}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4">
          {appliedAt ? (
            <p className="text-sm font-medium text-gray-400">Aplicado dia {appliedAt}.</p>
          ) : (
            <div />
          )}
          <Button
            variant="danger"
            icon={<FaTrash />}
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={isDeleting}
            className="justify-center"
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
                Você realmente deseja cancelar sua aplicação a vaga de {jobTitle} na {companyName}?
              </p>
              <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-5">
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <Image
                      src={resolveFileUrl(logoUrl)}
                      alt={companyName}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-xl border border-gray-800 bg-white/95 object-cover p-2"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-black text-sm font-semibold text-gray-200">
                      {companyInitials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-gray-100">
                      {jobTitle}
                    </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-300">
                  <MdBusiness className="h-4 w-4 shrink-0 text-gray-500" />
                  <span className="truncate">{companyName}</span>
                </div>
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
