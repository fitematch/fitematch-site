import { Metadata } from 'next';
import { THEME } from '@/constants/theme';
import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata: Metadata = {
  title: 'Criar conta',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <section className={`flex min-h-screen items-center justify-center ${THEME.layout.background} px-4 py-20`}>
      <div className="w-full">
        <h1 className={`mb-8 text-center text-3xl font-bold ${THEME.text.title}`}>
          CRIE SUA CONTA
        </h1>
        <SignUpForm />
      </div>
    </section>
  );
}
