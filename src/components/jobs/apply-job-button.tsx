'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ApplyService } from '@/services/apply/apply.service';
import { ProductRoleEnum } from '@/types/entities/user.entity';

interface ApplyJobButtonProps {
  jobId: string;
  hasAlreadyApplied?: boolean;
  onApplied?: () => void;
}

export function ApplyJobButton({
  jobId,
  hasAlreadyApplied = false,
  onApplied,
}: ApplyJobButtonProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;
  const isRecruiter = user?.productRole === ProductRoleEnum.RECRUITER;

  const canApply = isAuthenticated && isCandidate && !hasAlreadyApplied;

  async function handleApply() {
    if (!isAuthenticated) {
      showError('Você precisa estar logado para se candidatar.');
      return;
    }

    if (isRecruiter) {
      showError('Recrutadores não podem se candidatar a vagas.');
      return;
    }

    if (!isCandidate) {
      showError('Apenas candidatos podem se candidatar a vagas.');
      return;
    }

    if (hasAlreadyApplied) {
      showError('Você já se candidatou a esta vaga.');
      return;
    }

    try {
      setIsSubmitting(true);

      await ApplyService.create({
        jobId,
      });

      showSuccess('Candidatura realizada com sucesso.');
      onApplied?.();
      router.refresh();
    } catch {
      showError('Não foi possível realizar sua candidatura.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start w-full">
      {isCandidate && isAuthenticated && (
        <Button
          type="button"
          variant="positive"
          icon={<FaPaperPlane />}
          disabled={!canApply || isSubmitting}
          onClick={handleApply}
          className="self-start"
        >
          {hasAlreadyApplied ? 'Candidatura enviada' : 'Aplicar'}
        </Button>
      )}
    </div>
  );
}
