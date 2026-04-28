import { PrivateRoute } from '@/components/auth/private-route';
import { ProfileForm } from '@/components/profile/profile-form';

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <section className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-100">
            Profile
          </h1>

          <p className="mt-3 text-gray-700">
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