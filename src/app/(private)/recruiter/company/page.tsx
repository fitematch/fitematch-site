import { PrivateRoute } from '@/components/auth/private-route';
import { CompanyRequestForm } from '@/components/companies/company-request-form';

export default function RecruiterCompanyPage() {
  return (
    <PrivateRoute>
      <section className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-100">
            Cadastrar empresa
          </h1>

          <p className="mt-3 text-gray-700">
            Envie os dados da sua empresa para análise da plataforma.
          </p>

          <div className="mt-10">
            <CompanyRequestForm />
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}