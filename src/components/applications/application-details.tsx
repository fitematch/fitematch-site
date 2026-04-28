
'use client';

import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplication } from '@/hooks/use-applications';
import { CancelApplicationButton } from './cancel-application-button';

interface ApplicationDetailsProps {
  applyId: string;
}

export function ApplicationDetails({ applyId }: ApplicationDetailsProps) {
  const { application, isLoading, error } = useApplication(applyId);

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!application) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-100">
        Aplicação #{application._id}
      </h1>

      <div className="mt-6 space-y-3 text-gray-700">
        <p>Status: {application.status}</p>
        <p>Job ID: {application.jobId}</p>
        <p>User ID: {application.userId}</p>
      </div>

      <div className="mt-8">
        <CancelApplicationButton applyId={application._id} />
      </div>
    </div>
  );
}
