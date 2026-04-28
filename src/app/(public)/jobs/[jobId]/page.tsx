'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useJob } from '@/hooks/use-job';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { ApplyJobButton } from '@/components/jobs/apply-job-button';
import { THEME } from '@/constants/theme';
import { JobCompanyHeader } from '@/components/jobs/job-company-header';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CARD_STYLES, TEXT_STYLES } from '@/constants/styles';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const { job, isLoading, error } = useJob(jobId);
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = usePublicCompanies();

  const company = job
    ? companies.find((item) => item._id === job.companyId)
    : undefined;

  if (isLoading || isLoadingCompanies) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (companiesError) {
    return <Alert type="error" message={companiesError} />;
  }

  if (!job) {
    return null;
  }

  return (
    <section className={`min-h-screen ${THEME.layout.background} px-4 py-20`}>
      <div className="mx-auto max-w-3xl">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Vagas', href: ROUTES.JOBS },
            { label: job.title },
          ]}
        />

        <div className={`mt-8 ${CARD_STYLES.jobDetailBox}`}>
        <JobCompanyHeader
          job={job}
          company={company}
          coverMode="detail"
        />

        <h1 className={TEXT_STYLES.jobDetailTitle}>
          {job.title}
        </h1>

        <p className={`mt-3 text-sm uppercase ${TEXT_STYLES.jobDetailText}`}>
          {job.status}
        </p>

        <p className={`mt-6 ${TEXT_STYLES.jobDetailText}`}>{job.description}</p>

        <p className={`mt-4 text-sm ${TEXT_STYLES.jobDetailText}`}>
          {job.slots === 1 ? '1 vaga disponível' : `${job.slots} vagas disponíveis`}
        </p>

        <div className="mt-10 flex items-center justify-end gap-4">
          <Link href={ROUTES.JOBS}>
            <Button color="gray" icon={<FaArrowLeft />}>
              Voltar para vagas
            </Button>
          </Link>

          <ApplyJobButton jobId={job._id} />
        </div>
      </div>
      </div>
    </section>
  );
}
