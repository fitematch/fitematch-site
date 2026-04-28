'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { HealthService } from '@/services/health/health.service';
import { HealthCheckResponse } from '@/services/health/health.types';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export function ApiStatusCard() {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await HealthService.check();
        setData(response);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkApi();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-40" />;
  }

  if (error) {
    return <Alert type="error" message="A API está indisponível." />;
  }

  return (
    <div className="rounded-xl border border-gray-900 p-6">
      <div className="flex items-center gap-3">
        <FaCheckCircle className="text-green-100" />

        <h2 className="text-xl font-semibold text-gray-100">
          API online
        </h2>
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-700">
        <p>Status: {data?.status}</p>

        {data?.uptime && <p>Uptime: {data.uptime}</p>}

        {data?.timestamp && <p>Timestamp: {data.timestamp}</p>}
      </div>
    </div>
  );
}
