import { Metadata } from 'next';
import { RecruiterCompanyForm } from '@/components/recruiter/company/recruiter-company-form';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { ROUTES } from '@/constants/routes';
import { DashboardShell } from '@/features/recruiter-dashboard/components/dashboard-shell';

export const metadata: Metadata = {
  title: 'Minha empresa',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterCompanyPage() {
  return (
    <DashboardShell title="" subtitle="">
      <div className="mx-auto w-full max-w-7xl">
        <RecruiterPageHeader
          breadcrumbs={[{ label: 'Home', href: ROUTES.HOME }, { label: 'Minha empresa' }]}
          title=""
          description=""
        />

        <RecruiterCompanyForm />
      </div>
    </DashboardShell>
  );
}
