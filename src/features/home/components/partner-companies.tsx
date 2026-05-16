'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { getUniqueCompaniesByBrand } from '@/utils/company-brand';
import { resolveFileUrl } from '@/utils/file-url';

export function PartnerCompanies() {
  const { companies, error, isLoading } = usePublicCompanies();
  const uniqueCompanies = getUniqueCompaniesByBrand(companies);

  if (!isLoading && !error && uniqueCompanies.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
          Empresas que usam a fitematch
        </p>

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
            uniqueCompanies.slice(0, 6).map((company, index) => (
              <motion.div
                key={company._id || company.slug || `${company.tradeName}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex h-24 items-center justify-center rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(199,245,29,0.08),transparent_54%),linear-gradient(135deg,rgba(244,244,245,0.98),rgba(212,212,216,0.96))] px-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_14px_40px_rgba(0,0,0,0.28),0_0_26px_rgba(34,197,94,0.08)]"
              >
                {company.media?.logoUrl ? (
                  <Image
                    src={resolveFileUrl(company.media.logoUrl)}
                    alt={company.tradeName}
                    width={144}
                    height={44}
                    unoptimized
                    className="max-h-11 max-w-full object-contain drop-shadow-[0_0_18px_rgba(0,0,0,0.12)]"
                  />
                ) : (
                  <span className="text-sm font-medium text-zinc-800">{company.tradeName}</span>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
