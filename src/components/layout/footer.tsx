import Link from 'next/link';
import { ArrowUpRight, Globe, Play, Radio, Send, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const FOOTER_LINKS = [
  { href: ROUTES.JOBS, label: 'Vagas' },
  { href: ROUTES.FAQ, label: 'FAQ' },
  { href: ROUTES.PRIVACY_POLICY, label: 'Privacidade' },
  { href: ROUTES.TERMS_OF_USE, label: 'Termos' },
];

const SOCIAL_LINKS = [
  { href: '#', label: 'Instagram', icon: Globe },
  { href: '#', label: 'LinkedIn', icon: Send },
  { href: '#', label: 'X', icon: Radio },
  { href: '#', label: 'YouTube', icon: Play },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="text-xl font-semibold tracking-[-0.04em]">
                <span className="text-zinc-50">fite</span>
                <span className="text-lime-400">match</span>
              </span>
            </div>

            <div className="max-w-xl space-y-3">
              <p className="text-lg text-zinc-100">
                Infraestrutura de contratação para operações fitness que querem velocidade, precisão
                e consistência.
              </p>
              <p className="text-sm leading-7 text-zinc-500">
                Centralize vagas, validação de candidatos e posicionamento da sua marca empregadora
                em uma experiência moderna, direta e escalável.
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
                Navegação
              </p>
              <div className="flex flex-col gap-3">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
                Canais
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:text-lime-400"
                      aria-label={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-zinc-800 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 fitematch. Todos os direitos reservados.</p>
          <p>Fitness hiring infrastructure for modern gyms.</p>
        </div>
      </div>
    </footer>
  );
}
