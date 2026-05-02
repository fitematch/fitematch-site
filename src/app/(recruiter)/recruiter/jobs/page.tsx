import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobsList } from '@/components/recruiter/jobs/recruiter-jobs-list';

export default function RecruiterJobsPage() {
  return (
    <section className="min-h-screen bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <RecruiterPageHeader
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
    </section>
  );
}
