import { PrivateRoute } from '@/components/auth/private-route';
import { SessionList } from '@/components/sessions/session-list';

export default function SessionsPage() {
  return (
    <PrivateRoute>
      <section className="min-h-screen bg-black px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-100">
            Sessões
          </h1>

          <p className="mt-3 text-gray-300">
            Veja os dispositivos conectados à sua conta.
          </p>

          <div className="mt-10">
            <SessionList />
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}
