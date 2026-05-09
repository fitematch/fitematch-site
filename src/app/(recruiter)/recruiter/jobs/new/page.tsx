import { Metadata } from 'next';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobForm } from '@/components/recruiter/jobs/recruiter-job-form';
import { ROUTES } from '@/constants/routes';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';

export const metadata: Metadata = {
  title: 'Nova vaga',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterNewJobPage() {
  return (
    <DashboardShell title="" subtitle="">
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Minhas vagas', href: ROUTES.RECRUITER_JOBS },
            { label: 'Nova vaga' },
          ]}
          title=""
          description=""
        />

        <RecruiterJobForm mode="create" />
      </div>
    </DashboardShell>
  );
}
