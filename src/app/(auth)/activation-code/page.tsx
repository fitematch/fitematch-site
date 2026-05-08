import { Metadata } from 'next';
import { ActivationCodeForm } from '@/components/auth/activation-code-form';

export const metadata: Metadata = {
  title: 'Código de ativação',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivationCodePage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_24%)]" />
      <div className="relative w-full max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-lime-400">Ativação</p>
        </div>
        <ActivationCodeForm />
      </div>
    </section>
  );
}
