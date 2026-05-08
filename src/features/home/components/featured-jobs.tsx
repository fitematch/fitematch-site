'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, MapPin, Sparkles, Users } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useJobs } from '@/hooks/use-jobs';

export function FeaturedJobs() {
  const { jobs, isLoading, error } = useJobs();
  const featuredJobs = jobs.slice(0, 3);

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
              Vagas em destaque
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-zinc-50 sm:text-4xl">
              Oportunidades com posicionamento claro, operação séria e expectativa real.
            </h2>
          </div>

          <Link
            href={ROUTES.JOBS}
            className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-50"
          >
            Ver todas as vagas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 xl:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950"
              />
            ))}

          {!isLoading &&
            !error &&
            featuredJobs.map((job, index) => (
              <motion.article
                key={job._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_20px_60px_rgba(0,0,0,0.32),0_0_30px_rgba(34,197,94,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/15 bg-lime-500/10 px-3 py-1 text-xs text-lime-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Destaque
                  </span>
                  <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {job.contractType || 'Fitness'}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-zinc-50">
                  {job.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">{job.company.tradeName}</p>

                <p className="mt-5 line-clamp-4 text-sm leading-7 text-zinc-400">
                  {job.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5">
                    <Users className="h-3.5 w-3.5 text-lime-400" />
                    {job.slots} vaga(s)
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5">
                    <MapPin className="h-3.5 w-3.5 text-lime-400" />
                    {job.company.contacts?.address?.city || 'Brasil'}
                  </span>
                </div>

                <Link
                  href={`${ROUTES.JOBS}/${job.slug || job._id}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-100 transition-colors hover:text-lime-400"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Ver oportunidade
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
        </div>

        {!isLoading && error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
