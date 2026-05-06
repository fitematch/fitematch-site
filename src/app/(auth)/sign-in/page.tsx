import { Metadata } from 'next';
import { THEME } from '@/constants/theme';
import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata: Metadata = {
  title: 'Login',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <section className={`flex min-h-screen items-center justify-center ${THEME.layout.background} px-4`}>
      <div className="w-full">
        <h1 className={`mb-8 text-center text-3xl font-bold ${THEME.text.title}`}>
          fitematch | LOGIN
        </h1>

        <SignInForm />
      </div>
    </section>
  );
}
