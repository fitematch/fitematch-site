import Image from 'next/image';
import { JobEntity } from '@/types/entities/job.entity';
import { PublicCompanyResponse } from '@/services/company/company.types';
import { THEME } from '@/constants/theme';

interface JobCompanyHeaderProps {
  job: JobEntity;
  company?: PublicCompanyResponse;
  coverMode?: 'card' | 'detail';
}

export function JobCompanyHeader({
  job,
  company,
  coverMode = 'card',
}: JobCompanyHeaderProps) {
  const location = [
    company?.contacts?.address?.city,
    company?.contacts?.address?.state,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {job.media?.coverUrl && (
        <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-xl border-b border-gray-900">
          <Image
            src={job.media.coverUrl}
            alt={job.title}
            width={640}
            height={coverMode === 'detail' ? 640 : 224}
            unoptimized
            className={`w-full ${
              coverMode === 'detail'
                ? 'block h-auto object-contain'
                : 'h-44 object-cover'
            }`}
          />
        </div>
      )}

      {company && (
        <div className="mb-5 flex items-center gap-3">
          {company.media?.logoUrl ? (
            <Image
              src={company.media.logoUrl}
              alt={company.tradeName}
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 rounded-lg border border-gray-800 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-800 bg-gray-950 text-sm font-semibold text-gray-300">
              {company.tradeName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${THEME.text.title}`}>
              {company.tradeName}
            </p>
            {location && (
              <p className={`truncate text-xs ${THEME.text.body}`}>
                {location}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
