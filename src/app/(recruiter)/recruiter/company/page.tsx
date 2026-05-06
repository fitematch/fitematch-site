import { Metadata } from 'next';
import { RecruiterCompanyForm } from '@/components/recruiter/company/recruiter-company-form';
import { RecruiterPageHeader } from '@/components/recruiter/recruiter-page-header';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';

export const metadata: Metadata = {
  title: 'Minha empresa',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterCompanyPage() {
  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <RecruiterPageHeader
          breadcrumbs={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Minha empresa' },
          ]}
          title="Minha empresa"
          description="Cadastre ou atualize a empresa responsável pelas vagas que você vai publicar na plataforma."
        />

        <RecruiterCompanyForm />
      </div>
    </section>
  );
}
