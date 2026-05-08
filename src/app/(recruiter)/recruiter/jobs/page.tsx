import { Metadata } from 'next';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobsList } from '@/components/recruiter/jobs/recruiter-jobs-list';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';

export const metadata: Metadata = {
  title: 'Minhas vagas',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterJobsPage() {
  return (
    <DashboardShell
      title="Minhas vagas"
      subtitle="Gerencie publicações, status e fluxo de candidatos"
    >
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[{ label: 'Home', href: ROUTES.HOME }, { label: 'Minhas vagas' }]}
          title="Minhas vagas"
          description="Gerencie as vagas publicadas pela sua empresa."
          action={
            <Link href={ROUTES.RECRUITER_NEW_JOB}>
              <Button variant="positive" icon={<FaPlus />}>
                Nova vaga
              </Button>
            </Link>
          }
        />

        <RecruiterJobsList />
      </div>
    </DashboardShell>
  );
}
