'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { MdOutlineFindInPage } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useJobs } from '@/hooks/use-jobs';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionTitle } from '@/components/ui/section-title';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';
import { JobCard } from '@/components/jobs/job-card';

export function FeaturedJobsSection() {
  const { jobs, isLoading, error } = useJobs();
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = usePublicCompanies();
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const companiesById = Object.fromEntries(
    companies.map((company) => [company._id, company]),
  );
  const featuredJobs = jobs.length <= 3
    ? jobs
    : Array.from({ length: 3 }, (_, index) => {
        const jobIndex = (startIndex + index) % jobs.length;

        return jobs[jobIndex];
      });

  useEffect(() => {
    if (jobs.length <= 3) {
      return;
    }

    let transitionTimeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      setIsTransitioning(true);

      transitionTimeoutId = window.setTimeout(() => {
        setStartIndex((current) => (current + 1) % jobs.length);
        setIsTransitioning(false);
      }, 300);
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
      if (transitionTimeoutId) {
        window.clearTimeout(transitionTimeoutId);
      }
    };
  }, [jobs.length]);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#080b0f_0%,#0a0a0a_55%,#000000_100%)] py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-70px] left-[14%] h-64 w-64 rounded-full bg-gray-100/7 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[12%] h-80 w-80 rounded-full bg-slate-300/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08),transparent_36%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle
            title="VAGAS EM DESTAQUE"
            icon={<MdOutlineFindInPage className="h-6 w-6" />}
          />

          <Link href={ROUTES.JOBS}>
            <Button variant="login" icon={<FaArrowRight />}>
              Ver todas
            </Button>
          </Link>
        </div>

        {(isLoading || isLoadingCompanies) && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80" />
            ))}
          </div>
        )}

        {error && <Alert type="error" message={error} />}

        {companiesError && <Alert type="error" message={companiesError} />}

        {!isLoading && !isLoadingCompanies && !error && !companiesError && featuredJobs.length === 0 && (
          <EmptyState message="Nenhuma vaga em destaque encontrada." />
        )}

        {!isLoading && !isLoadingCompanies && !error && !companiesError && featuredJobs.length > 0 && (
          <div
            className={`grid gap-6 transition-opacity duration-300 md:grid-cols-2 lg:grid-cols-3 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                company={companiesById[job.companyId]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
