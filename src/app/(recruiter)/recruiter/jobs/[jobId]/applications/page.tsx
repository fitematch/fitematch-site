'use client';

import { useParams } from 'next/navigation';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobApplicationsList } from '@/components/recruiter/applications/recruiter-job-applications-list';

export default function RecruiterJobApplicationsPage() {
  const params = useParams<{ jobId: string }>();

  return (
    <section className="min-h-screen bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <RecruiterPageHeader
          title="Candidatos da vaga"
          description="Visualize e atualize o status dos candidatos inscritos nesta vaga."
        />

        <RecruiterJobApplicationsList jobId={params.jobId} />
      </div>
    </section>
  );
}
