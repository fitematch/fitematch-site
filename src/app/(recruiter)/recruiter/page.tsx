import { Metadata } from 'next';
import { RecruiterDashboard } from '@/features/recruiter-dashboard/components/recruiter-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard recruiter',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterDashboardPage() {
  return <RecruiterDashboard />;
}
