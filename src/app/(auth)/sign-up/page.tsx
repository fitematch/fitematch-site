
import { THEME } from '@/constants/theme';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <section className={`flex min-h-screen items-center justify-center ${THEME.layout.background} px-4 py-20`}>
      <div className="w-full">
        <h1 className={`mb-8 text-center text-3xl font-bold ${THEME.text.title}`}>
          Criar conta
        </h1>

        <SignUpForm />
      </div>
    </section>
  );
}
