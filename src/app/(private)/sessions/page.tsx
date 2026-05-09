import { Metadata } from 'next';
import { PrivateRoute } from '@/components/auth/private-route';
import { SessionList } from '@/components/sessions/session-list';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES } from '@/constants/styles';

export const metadata: Metadata = {
  title: 'Sessões',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SessionsPage() {
  return (
    <PrivateRoute>
      <section className={`${PAGE_STYLES.body} py-20`}>
        <div className={PAGE_STYLES.container}>
          <Breadcrumb items={[{ label: 'Home', href: ROUTES.HOME }, { label: 'Sessões' }]} />
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-lime-400">
            Sessões
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Gerencie os dispositivos conectados à sua conta e revogue acessos antigos com segurança.
          </p>
          <div className="mt-10">
            <SessionList />
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}
