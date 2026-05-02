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
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  className="flex h-24 items-center justify-center rounded-xl border border-gray-500 bg-gray-100 px-4 text-center"
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
