import { ApplicationList } from '@/components/applications/application-list';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { TEXT_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';

export default function ApplicationsPage() {
  return (
    <section className={`min-h-screen ${THEME.layout.background} py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Minhas candidaturas' },
          ]}
        />

        <h1 className={`${TEXT_STYLES.pageTitle} mt-8`}>
          Minhas candidaturas
        </h1>

        <p className={TEXT_STYLES.pageSubtitle}>
          Acompanhe o status das vagas que você se candidatou.
        </p>

        <div className="mt-10">
          <ApplicationList />
        </div>
      </div>
    </section>
  );
}
