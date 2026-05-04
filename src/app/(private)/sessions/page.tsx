import { PrivateRoute } from '@/components/auth/private-route';
import { SessionList } from '@/components/sessions/session-list';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { TEXT_STYLES } from '@/constants/styles';

export default function SessionsPage() {
  return (
    <PrivateRoute>
      <section className="min-h-screen bg-black py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: ROUTES.HOME },
              { label: 'Sessões' },
            ]}
          />

          <h1 className={TEXT_STYLES.pageTitle}>
            Sessões
          </h1>

          <p className={TEXT_STYLES.pageSubtitle}>
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
