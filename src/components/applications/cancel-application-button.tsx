'use client';

import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ApplyService } from '@/services/apply/apply.service';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ROUTES } from '@/constants/routes';

interface CancelApplicationButtonProps {
  applyId: string;
}

export function CancelApplicationButton({
  applyId,
}: CancelApplicationButtonProps) {
  const router = useRouter();
  const { showSuccess, showError } = useFlashMessage();

  async function handleCancel() {
    try {
      await ApplyService.delete(applyId);
      showSuccess('Candidatura cancelada com sucesso.');
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
