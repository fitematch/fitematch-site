import { PrivateRoute } from '@/components/auth/private-route';
import { ProfileForm } from '@/components/profile/profile-form';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES, TEXT_STYLES } from '@/constants/styles';

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <section className={`${PAGE_STYLES.body} py-20`}>
        <div className={PAGE_STYLES.container}>
          <Breadcrumb
            items={[
              { label: 'Home', href: ROUTES.HOME },
              { label: 'Profile' },
            ]}
          />
          <h1 className={`${TEXT_STYLES.pageTitle} mt-4`}>
            Profile
          </h1>
          <p className={TEXT_STYLES.pageSubtitle}>
            Atualize seus dados básicos e complementares.
          </p>
          <div className="mt-10">
            <ProfileForm />
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}
