'use client';

import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ApplyService } from '@/services/apply/apply.service';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ROUTES } from '@/constants/routes';

interface CancelApplicationButtonProps {
  applyId: string;
  onDeleted?: () => Promise<void> | void;
}

export function CancelApplicationButton({
  applyId,
  onDeleted,
}: CancelApplicationButtonProps) {
  const router = useRouter();
  const { showSuccess, showError } = useFlashMessage();

  async function handleCancel() {
    try {
      await ApplyService.delete(applyId);
      showSuccess('Candidatura cancelada com sucesso.');
      await onDeleted?.();
      router.push(ROUTES.APPLICATIONS);
    } catch {
      showError('Não foi possível cancelar sua candidatura.');
    }
  }

  return (
    <Button
      type="button"
      variant="danger"
      icon={<FaTrash />}
      onClick={handleCancel}
    >
      Cancelar candidatura
    </Button>
  );
}
