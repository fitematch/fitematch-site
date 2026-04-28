'use client';

import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplications } from '@/hooks/use-applications';
import { ApplicationCard } from './application-card';

export function ApplicationList() {
  const { applications, isLoading, error } = useApplications();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (applications.length === 0) {
    return (
      <EmptyState message="Você ainda não possui candidaturas cadastradas." />
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application._id} application={application} />
      ))}
    </div>
  );
}
