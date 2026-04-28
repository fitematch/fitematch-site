import { PrivateRoute } from '@/components/auth/private-route';
import { ApplicationList } from '@/components/applications/application-list';

export default function ApplicationsPage() {
  return (
    <PrivateRoute>
      <section className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-100">
            Minhas aplicações
          </h1>

          <p className="mt-3 text-gray-700">
            Acompanhe as vagas em que você se candidatou.
          </p>

          <div className="mt-10">
            <ApplicationList />
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}
