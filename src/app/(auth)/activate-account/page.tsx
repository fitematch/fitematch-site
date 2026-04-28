import { THEME } from '@/constants/theme';
import { ActivateAccountForm } from '@/components/auth/activate-account-form';

export default function ActivateAccountPage() {
  return (
    <section
      className={`flex min-h-screen items-center justify-center ${THEME.layout.background} px-4 py-20`}
    >
      <div className="w-full max-w-md">
        <h1 className={`text-center text-3xl font-bold ${THEME.text.title}`}>
          Ativar conta
        </h1>

        <p className={`mt-3 text-center text-sm ${THEME.text.subtitle}`}>
          Informe seu e-mail e o código recebido para ativar sua conta.
        </p>

        <div className="mt-8">
          <ActivateAccountForm />
        </div>
      </div>
    </section>
  );
}
