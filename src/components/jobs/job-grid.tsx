'use client';

import { useMemo, useState } from 'react';
import { JobCard } from './job-card';
import { useJobs } from '@/hooks/use-jobs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';
import { PaginationBox } from '@/components/ui/pagination-box';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { Select } from '@/components/ui/select';

interface JobGridProps {
  search: string;
}

export function JobGrid({ search }: JobGridProps) {
  const { jobs, isLoading, error } = useJobs();
  const breakpoint = useBreakpoint();

  const [page, setPage] = useState(1);
  const [contractType, setContractType] = useState('');

  // Responsividade
  let itemsPerPage = 6;
  let gridCols = 'md:grid-cols-2 lg:grid-cols-3';

  if (breakpoint === 'tablet') {
    itemsPerPage = 4;
    gridCols = 'md:grid-cols-2 lg:grid-cols-2';
  } else if (breakpoint === 'mobile') {
    itemsPerPage = 2;
    gridCols = 'md:grid-cols-1 lg:grid-cols-1';
  }

  // Filtro
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesContract =
        !contractType || job.contractType === contractType;

      return matchesSearch && matchesContract;
    });
  }, [jobs, search, contractType]);

  // Paginação segura (sem setState no render/effect)
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  const startIdx = (safePage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const jobsToShow = filteredJobs.slice(startIdx, endIdx);

  function handleContractTypeChange(value: string) {
    setContractType(value);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  if (isLoading) {
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

  return (
    <>
      {/* Filtro */}
      <div className="mb-6">
        <Select
          value={contractType}
          onChange={(event) => handleContractTypeChange(event.target.value)}
          options={[
            { value: '', label: 'Todos os tipos' },
            { value: 'clt', label: 'CLT' },
            { value: 'pj', label: 'PJ' },
            { value: 'freelance', label: 'Freelance' },
            { value: 'internship', label: 'Estágio' },
            { value: 'temporary', label: 'Temporário' },
            { value: 'part_time', label: 'Meio período' },
            { value: 'full_time', label: 'Tempo integral' },
            { value: 'autonomous', label: 'Autônomo' },
          ]}
        />
      </div>

      {/* Conteúdo */}
      {filteredJobs.length === 0 ? (
        <EmptyState message="Nenhuma vaga encontrada." />
      ) : (
        <>
          <div className={`grid gap-6 ${gridCols}`}>
            {jobsToShow.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          <PaginationBox
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}