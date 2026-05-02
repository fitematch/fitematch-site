'use client';

import { useApplications } from '@/hooks/use-applications';
import { ApplicationCard } from './application-card';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

export function ApplicationList() {
  const { applications, isLoading, error, refetch } = useApplications();

  if (isLoading) {
    return <Skeleton className="h-40" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (applications.length === 0) {
    return <EmptyState message="Você ainda não se candidatou a nenhuma vaga." />;
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application._id || `${application.jobId}-${application.userId}-${application.createdAt || application.updatedAt || 'application'}`}
          application={application}
          onDeleted={refetch}
        />
      ))}
    </div>
  );
}
