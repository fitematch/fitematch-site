import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { RecruiterJobForm } from '@/components/recruiter/jobs/recruiter-job-form';

export default function RecruiterNewJobPage() {
  return (
    <section className="min-h-screen bg-black px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <RecruiterPageHeader
          title="Nova vaga"
          description="Publique uma nova vaga para candidatos da plataforma."
        />

        <RecruiterJobForm mode="create" />
      </div>
    </section>
  );
}
