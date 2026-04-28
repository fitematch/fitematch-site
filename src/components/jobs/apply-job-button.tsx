'use client';

import { FaCheck } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useApply } from '@/hooks/use-apply';
import { useFlashMessage } from '@/contexts/flash-message-context';

export function ApplyJobButton({ jobId }: { jobId: string }) {
  const { apply, isLoading } = useApply();
  const { showSuccess, showError } = useFlashMessage();

  async function handleApply() {
    try {
      await apply(jobId);
      showSuccess('Candidatura realizada com sucesso.');
    } catch {
      showError('Não foi possível realizar a candidatura.');
    }
  }

  return (
    <Button
      onClick={handleApply}
      disabled={isLoading}
      icon={<FaCheck />}
    >
      Aplicar-se à vaga
    </Button>
  );
}
