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
    <article className="rounded-2xl border border-gray-900 bg-black p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Vaga</p>
          <h2 className="text-lg font-semibold text-gray-100">
            {application.jobId}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Status: {application.status}
          </p>
        </div>

        <Button
          variant="danger"
          icon={<FaTrash />}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
      </div>
    </article>
  );
}
