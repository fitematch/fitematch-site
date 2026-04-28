'use client';

import { useEffect, useState } from 'react';
import ApplyEntity from '@/types/entities/apply.entity';
import { ApplyService } from '@/services/apply/apply.service';

export function useApplication(applyId: string) {
  const [application, setApplication] = useState<ApplyEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applyId) return;

    async function fetchApplication() {
      try {
        const data = await ApplyService.read(applyId);
        setApplication(data);
      } catch {
        setError('Não foi possível carregar a aplicação.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplication();
  }, [applyId]);

  return { application, isLoading, error };
}