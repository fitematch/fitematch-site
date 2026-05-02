'use client';

import Image from 'next/image';
import { FaBuilding } from 'react-icons/fa';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { SectionTitle } from '@/components/ui/section-title';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';

export function CompaniesSection() {
  const { companies, isLoading, error } = usePublicCompanies();

  if (!isLoading && !error && companies.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#10151b_0%,#0c1116_46%,#080b0f_100%)] py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-8 right-[12%] h-64 w-64 rounded-full bg-slate-300/10 blur-3xl" />
        <div className="absolute bottom-[-90px] left-[10%] h-80 w-80 rounded-full bg-gray-100/6 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.09),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.09),transparent_35%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="EMPRESAS QUE USAM A PLATAFORMA"
          icon={<FaBuilding className="h-6 w-6" />}
        />

        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24" />
              ))}
            </div>
          )}

          {error && <Alert type="error" message={error} />}

          {!isLoading && !error && companies.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {companies.map((company, index) => (
                <div
                  key={company._id || company.slug || `${company.tradeName}-${index}`}
                  className="flex h-24 items-center justify-center rounded-[1.25rem] border border-gray-200 bg-gray-100 px-4 text-center shadow-[0_16px_35px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-1 hover:border-white hover:bg-white"
                >
                  {company.media?.logoUrl ? (
                    <Image
                      src={company.media.logoUrl}
                      alt={company.tradeName}
                      width={160}
                      height={48}
                      unoptimized
                      className="max-h-12 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {company.tradeName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
