

import { THEME } from '@/constants/theme';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <section className={`flex min-h-screen items-center justify-center ${THEME.layout.background} px-4`}>
      <div className="w-full">
        <h1 className={`mb-8 text-center text-3xl font-bold ${THEME.text.title}`}>
          Entrar
        </h1>

        <SignInForm />
      </div>
    </section>
  );
}
