'use client';

import { motion } from 'framer-motion';
import { Activity, BadgeCheck, Building2, SearchCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: SearchCheck,
    title: 'Triagem mais inteligente',
    description: 'Organize perfis, competências e sinais de aderência com menos ruído operacional.',
  },
  {
    icon: Building2,
    title: 'Employer branding forte',
    description:
      'Apresente sua academia como operação premium com páginas e vagas de alta conversão.',
  },
  {
    icon: BadgeCheck,
    title: 'Processo confiável',
    description:
      'Centralize informações essenciais para contratar com previsibilidade e velocidade.',
  },
  {
    icon: Activity,
    title: 'Visão de performance',
    description:
      'Acompanhe o funil de contratação com leitura clara de volume, qualidade e resposta.',
  },
];

export function HomeFeatures() {
  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
            Funcionalidades
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-zinc-50 sm:text-4xl">
            Um stack de contratação criado para operações fitness modernas.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Estrutura limpa, velocidade de execução e experiência de produto consistente para
            academias, estúdios e redes que não querem operar no improviso.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_18px_60px_rgba(0,0,0,0.32),0_0_30px_rgba(34,197,94,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-50">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
