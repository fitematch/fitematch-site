import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
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
    <DashboardShell title="" subtitle="">
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[{ label: 'Home', href: ROUTES.HOME }, { label: 'Minhas vagas' }]}
          title=""
          description=""
          action={
            <Link href={ROUTES.RECRUITER_NEW_JOB}>
              <Button
                variant="positive"
                icon={<Plus className="h-4 w-4" />}
                className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
              >
                Cadastrar Nova vaga
              </Button>
            </Link>
          }
        />

        <RecruiterJobsList />
      </div>
    </DashboardShell>
  );
}
