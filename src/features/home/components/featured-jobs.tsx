'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Users, Wallet } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useJobs } from '@/hooks/use-jobs';
import { resolveFileUrl } from '@/utils/file-url';

export function FeaturedJobs() {
  const { jobs, isLoading, error } = useJobs();
  const featuredJobs = jobs.slice(0, 3);

  const formatSalary = (salary?: number | string) => {
    if (typeof salary === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }).format(salary);
    }

    return salary || 'Salário a combinar';
  };

  const formatSlots = (slots?: number) => {
    if (!slots || slots <= 1) {
      return '1 vaga';
    }

    return `${slots} vagas`;
  };

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
              Vagas em destaque
            </p>
          </div>

          <Link
            href={ROUTES.JOBS}
            className="inline-flex items-center gap-2 rounded-xl border border-lime-500/20 bg-lime-500/10 px-4 py-2.5 text-sm font-medium text-lime-300 transition-all hover:-translate-y-0.5 hover:border-lime-500/35 hover:bg-lime-500/15 hover:text-lime-200"
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
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_20px_60px_rgba(0,0,0,0.32),0_0_30px_rgba(34,197,94,0.08)]"
              >
                <div className="relative h-44 bg-[radial-gradient(circle_at_top,rgba(199,245,29,0.16),transparent_48%),linear-gradient(180deg,rgba(24,24,27,0.7),rgba(9,9,11,0.95))]">
                  {job.media?.coverUrl && (
                    <Image
                      src={resolveFileUrl(job.media.coverUrl)}
                      alt={job.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-black/70 px-3 py-1.5 text-xs font-medium text-lime-300 backdrop-blur">
                    <Wallet className="h-3.5 w-3.5" />
                    {formatSalary(job.benefits?.salary)}
                  </div>

                  {job.contractType && (
                    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-lime-400" />
                      {job.contractType}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 w-full px-6 pb-5 pt-12">
                    <h3 className="text-xl font-semibold text-zinc-50">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-lime-400" />
                        {job.company.tradeName}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-lime-400" />
                        {job.company.contacts?.address?.city || 'Brasil'}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-lime-400" />
                        {formatSlots(job.slots)}
                      </span>
                    </div>
                  </div>
                </div>
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
