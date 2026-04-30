'use client';

import { useState } from 'react';
import { JobCard } from './job-card';
import { useJobs } from '@/hooks/use-jobs';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';
import { PaginationBox } from '@/components/ui/pagination-box';
import { useBreakpoint } from '@/hooks/use-breakpoint';

export function JobGrid() {
  const { jobs, isLoading, error } = useJobs();
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = usePublicCompanies();
  const breakpoint = useBreakpoint();
  const [page, setPage] = useState(1);

  // Define quantos itens por página conforme o breakpoint
  let itemsPerPage = 6;
  let gridCols = 'md:grid-cols-2 lg:grid-cols-3';
  if (breakpoint === 'tablet') {
    itemsPerPage = 4;
    gridCols = 'md:grid-cols-2 lg:grid-cols-2';
  } else if (breakpoint === 'mobile') {
    itemsPerPage = 2;
    gridCols = 'md:grid-cols-1 lg:grid-cols-1';
  }

  const companiesById = Object.fromEntries(
    companies.map((company) => [company._id, company]),
  );

  if (isLoading || isLoadingCompanies) {
    return (
      <div className={`grid gap-6 ${gridCols}`}>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
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

  // Paginação
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const jobsToShow = jobs.slice(startIdx, endIdx);

  // Se mudar o breakpoint e a página atual ficar inválida, volta para a última página válida
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
    return null;
  }

  return (
    <>
      <div className={`grid gap-6 ${gridCols}`}>
        {jobsToShow.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            company={companiesById[job.companyId]}
          />
        ))}
      </div>
      <PaginationBox
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
