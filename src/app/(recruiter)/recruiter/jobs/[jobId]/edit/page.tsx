'use client';

import { useParams } from 'next/navigation';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobForm } from '@/components/recruiter/jobs/recruiter-job-form';
import { useJob } from '@/hooks/use-job';

export default function RecruiterEditJobPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const { job, isLoading, error } = useJob(jobId);

  return (
    <section className="min-h-screen bg-black px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <RecruiterPageHeader
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
