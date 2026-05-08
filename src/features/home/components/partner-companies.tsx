'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { resolveFileUrl } from '@/utils/file-url';

export function PartnerCompanies() {
  const { companies, error, isLoading } = usePublicCompanies();

  if (!isLoading && !error && companies.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-lime-400">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-zinc-500">
              Empresas parceiras
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-zinc-50">
              Marcas que já usam a fitematch para contratar melhor.
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950"
              />
            ))}

          {!isLoading &&
            !error &&
            companies.slice(0, 6).map((company, index) => (
              <motion.div
                key={company._id || company.slug || `${company.tradeName}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex h-24 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/90 px-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_14px_40px_rgba(0,0,0,0.28),0_0_26px_rgba(34,197,94,0.08)]"
              >
                {company.media?.logoUrl ? (
                  <Image
                    src={resolveFileUrl(company.media.logoUrl)}
                    alt={company.tradeName}
                    width={144}
                    height={44}
                    unoptimized
                    className="max-h-11 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{company.tradeName}</span>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
