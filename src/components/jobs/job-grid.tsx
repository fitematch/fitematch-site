'use client';

import { JobCard } from './job-card';
import { useJobs } from '@/hooks/use-jobs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';

export function JobGrid() {
  const { jobs, isLoading, error } = useJobs();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (jobs.length === 0) {
    return <EmptyState message="Nenhuma vaga encontrada." />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
