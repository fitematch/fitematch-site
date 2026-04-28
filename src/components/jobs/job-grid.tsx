'use client';

import { JobCard } from './job-card';
import { useJobs } from '@/hooks/use-jobs';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';

export function JobGrid() {
  const { jobs, isLoading, error } = useJobs();
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = usePublicCompanies();

  const companiesById = Object.fromEntries(
    companies.map((company) => [company._id, company]),
  );

  if (isLoading || isLoadingCompanies) {
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

  if (companiesError) {
    return <Alert type="error" message={companiesError} />;
  }

  if (jobs.length === 0) {
    return <EmptyState message="Nenhuma vaga encontrada." />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          company={companiesById[job.companyId]}
        />
      ))}
    </div>
  );
}
