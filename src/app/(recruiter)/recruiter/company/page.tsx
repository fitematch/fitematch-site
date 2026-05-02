import { RecruiterCompanyForm } from '@/components/recruiter/company/recruiter-company-form';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';

export default function RecruiterCompanyPage() {
  return (
    <section className="min-h-screen bg-black px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <RecruiterPageHeader
          title="Minha empresa"
          description="Cadastre ou atualize a empresa responsável pelas vagas que você vai publicar na plataforma."
        />

        <RecruiterCompanyForm />
      </div>
    </section>
  );
}
