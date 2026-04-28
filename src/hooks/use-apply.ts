'use client';

import { useState } from 'react';
import { ApplyService } from '@/services/apply/apply.service';

export function useApply() {
  const [isLoading, setIsLoading] = useState(false);

  async function apply(jobId: string) {
    setIsLoading(true);

    try {
      await ApplyService.create({ jobId });
    } finally {
      setIsLoading(false);
    }
  }

  return { apply, isLoading };
}
