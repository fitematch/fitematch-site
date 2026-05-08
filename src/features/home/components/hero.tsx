'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';

export function HomeHero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative flex min-h-[calc(100vh-81px)] items-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-sm text-lime-300"
          >
            <Sparkles className="h-4 w-4" />
            Plataforma premium para recrutamento fitness
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: 'easeOut' }}
            className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-zinc-50 sm:text-6xl lg:text-7xl"
          >
            Onde o <span className="text-zinc-50">fitness</span> encontra{' '}
            <span className="text-lime-400">performance</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400"
          >
            Reúna vagas, marca empregadora e triagem de candidatos em uma experiência de contratação
            mais rápida, sofisticada e orientada a resultado.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
            className="mt-6 text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500 sm:text-sm"
          >
            <span className="text-lime-400">Fit</span>
            <span className="text-zinc-300"> de profissionais. </span>
            <span className="text-lime-400">Match</span>
            <span className="text-zinc-300"> de resultados.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href={isAuthenticated ? ROUTES.APPLICATIONS : ROUTES.SIGN_UP}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-500 px-6 py-3 text-sm font-medium text-black transition-all hover:-translate-y-0.5 hover:bg-lime-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isAuthenticated ? 'Ver candidaturas' : 'Começar agora'}
            </Link>
            <Link
              href={ROUTES.JOBS}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Explorar vagas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-lime-500/15 blur-3xl" />
          <div className="absolute bottom-16 right-6 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_30px_120px_rgba(0,0,0,0.48),0_0_40px_rgba(34,197,94,0.08)]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <div>
                <p className="text-sm text-zinc-500">Hiring Overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Pipeline de elite</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1 text-xs text-lime-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Live
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {[
                ['Vagas ativas', '128', '+18% no mês'],
                ['Tempo de contratação', '6 dias', 'menos fricção operacional'],
                ['Perfis qualificados', '92%', 'matching mais preciso'],
              ].map(([label, value, meta], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5 backdrop-blur transition-all duration-300 hover:border-lime-500/25 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.06),0_0_24px_rgba(34,197,94,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-zinc-500">{label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-50">
                        {value}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                      {meta}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
