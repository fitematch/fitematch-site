import { THEME } from '@/constants/theme';
import { ActivationCodeForm } from '@/components/auth/activation-code-form';

export default function ActivationCodePage() {
  return (
    <section
      className={`flex min-h-screen items-center justify-center ${THEME.layout.background} px-4 py-20`}
    >
      <div className="w-full max-w-md">
        <h1 className={`text-center text-3xl font-bold ${THEME.text.title}`}>
          Código de ativação
        </h1>

        <p className={`mt-3 text-center text-sm ${THEME.text.subtitle}`}>
          Informe seu e-mail para receber um novo código de ativação.
        </p>

        <div className="mt-8">
          <ActivationCodeForm />
        </div>
      </div>
    </section>
  );
}
