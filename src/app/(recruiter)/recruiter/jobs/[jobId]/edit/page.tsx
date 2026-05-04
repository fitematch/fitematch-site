'use client';

import { useParams } from 'next/navigation';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobForm } from '@/components/recruiter/jobs/recruiter-job-form';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';
import { useMyJob } from '@/hooks/use-my-job';

export default function RecruiterEditJobPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const { job, isLoading, error } = useMyJob(jobId);

  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <RecruiterPageHeader
          breadcrumbs={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Minhas vagas', href: ROUTES.RECRUITER_JOBS },
            { label: 'Editar vaga' },
          ]}
          title="Editar vaga"
          description="Atualize os dados da vaga selecionada."
        />

        {isLoading && <p className="text-gray-700">Carregando vaga...</p>}

        {error && <p className="text-red-100">{error}</p>}

        {!isLoading && job && (
          <RecruiterJobForm mode="edit" jobId={jobId} initialValues={job} />
        )}
      </div>
    </section>
  );
}
