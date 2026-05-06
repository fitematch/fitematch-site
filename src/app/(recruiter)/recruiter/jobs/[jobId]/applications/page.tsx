'use client';

import { useParams } from 'next/navigation';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobApplicationsList } from '@/components/recruiter/applications/recruiter-job-applications-list';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';
import { useMyJob } from '@/hooks/use-my-job';

export default function RecruiterJobApplicationsPage() {
  const params = useParams<{ jobId: string }>();
  const { job } = useMyJob(params.jobId);
  const pageTitle = job?.title
    ? `Candidatos da vaga de ${job.title}`
    : 'Candidatos da vaga';
  const breadcrumbTitle = job?.title || 'Detalhes da vaga';

  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <RecruiterPageHeader
          breadcrumbs={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Minhas vagas', href: ROUTES.RECRUITER_JOBS },
            { label: breadcrumbTitle },
          ]}
          title={pageTitle}
          description="Visualize e atualize o status dos candidatos inscritos nesta vaga."
        />

        <RecruiterJobApplicationsList
          jobId={params.jobId}
          jobTitle={job?.title}
        />
      </div>
    </section>
  );
}
