import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Bus,
  Building2,
  GraduationCap,
  HeartPulse,
  MapPin,
  ShieldPlus,
  Soup,
  Users,
  Wallet,
} from 'lucide-react';
import { PublicCompanyResponse } from '@/services/company/company.types';
import { Button } from '@/components/ui/button';
import { EducationLevelEnum, JobEntity } from '@/types/entities/job.entity';
import { resolveFileUrl } from '@/utils/file-url';

interface JobCardProps {
  job: JobEntity;
  company?: PublicCompanyResponse;
  showRequirements?: boolean;
  hideDetailsButton?: boolean;
  customActions?: React.ReactNode;
  hideImageTitleAndLocation?: boolean;
  className?: string;
}

function getEducationLevelLabel(value: EducationLevelEnum) {
  return {
    [EducationLevelEnum.HIGH_SCHOOL]: 'Ensino Médio',
    [EducationLevelEnum.TECHNICAL]: 'Técnico',
    [EducationLevelEnum.BACHELOR]: 'Bacharelado',
    [EducationLevelEnum.ASSOCIATE]: 'Tecnólogo',
    [EducationLevelEnum.POSTGRADUATE]: 'Pós-graduação',
    [EducationLevelEnum.MBA]: 'MBA',
    [EducationLevelEnum.MASTER]: 'Mestrado',
    [EducationLevelEnum.DOCTORATE]: 'Doutorado',
    [EducationLevelEnum.EXTENSION]: 'Extensão',
    [EducationLevelEnum.OTHER]: 'Outro',
  }[value];
}

function getSlotsLabel(slots?: number) {
  if (!slots || slots <= 1) {
    return '1 vaga';
  }

  return `${slots} vagas`;
}

function BenefitItem({
  enabled,
  label,
  icon,
}: {
  enabled?: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/35 px-3 py-2 text-xs text-zinc-300">
      <span className={`shrink-0 ${enabled ? 'text-lime-400' : 'text-zinc-500'}`}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function RequirementItem({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/35 px-3 py-2 text-xs text-zinc-300">
      <span className="shrink-0 text-lime-400">{icon}</span>
      <p className="truncate text-xs text-zinc-200">{value}</p>
    </div>
  );
}

export function JobCard({
  job,
  company,
  showRequirements,
  hideDetailsButton = false,
  customActions,
  hideImageTitleAndLocation = false,
  className = '',
}: JobCardProps) {
  const jobCompany = (job as { company?: PublicCompanyResponse }).company;
  const displayCompany = jobCompany || company;
  const address = displayCompany?.contacts?.address;
  const location = address ? [address.city, address.state].filter(Boolean).join(' · ') : '';
  const isListCard = !hideDetailsButton;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)] ${className}`}
    >
      {job.media?.coverUrl && (
        <div className="-mx-6 -mt-6 mb-6 overflow-hidden border-b border-zinc-800">
          <div className="relative">
            <Image
              src={resolveFileUrl(job.media.coverUrl)}
              alt={job.title}
              width={900}
              height={isListCard ? 320 : 420}
              unoptimized
              className={`w-full object-cover ${isListCard ? 'h-44' : 'h-56'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {job.contractType && (
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-lime-400" />
                {job.contractType}
              </div>
            )}

            {!hideImageTitleAndLocation && (
              <div className="absolute bottom-0 left-0 w-full px-6 pb-5 pt-12">
                <h3 className="text-xl font-semibold text-zinc-50">{job.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                  {isListCard && displayCompany?.tradeName && (
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-lime-400" />
                      {displayCompany.tradeName}
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-lime-400" />
                      {location}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hideImageTitleAndLocation && (
        <div className="mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold text-zinc-50">{job.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {displayCompany?.tradeName && (
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-lime-400" />
                    {displayCompany.tradeName}
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-lime-400" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            {job.contractType && (
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-300">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-lime-400" />
                {job.contractType}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`space-y-5 ${isListCard ? 'flex flex-1 flex-col' : ''}`}>
        <div className="flex flex-wrap gap-2">
          {isListCard && job.benefits?.salary && (
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1.5 text-xs font-medium text-lime-300">
              <Wallet className="h-3.5 w-3.5" />
              {typeof job.benefits.salary === 'string'
                ? job.benefits.salary
                : `R$ ${job.benefits.salary.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}`}
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-3 py-1.5 text-xs text-zinc-300">
            <Users className="h-3.5 w-3.5 text-lime-400" />
            {getSlotsLabel(job.slots)}
          </span>
        </div>

        {job.description && (
          <p
            className={`whitespace-pre-line text-sm leading-6 text-zinc-400 ${
              isListCard ? 'min-h-[96px] line-clamp-4' : ''
            }`}
          >
            {job.description}
          </p>
        )}

        {!isListCard && (
          <div className="flex flex-wrap gap-2">
            {job.benefits?.salary && (
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1.5 text-xs font-medium text-lime-300">
                <Wallet className="h-3.5 w-3.5" />
                {typeof job.benefits.salary === 'string'
                  ? job.benefits.salary
                  : `R$ ${job.benefits.salary.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}`}
              </div>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-3 py-1.5 text-xs text-zinc-300">
              <Users className="h-3.5 w-3.5 text-lime-400" />
              {getSlotsLabel(job.slots)}
            </span>
          </div>
        )}

        {(showRequirements || isListCard) &&
          (job.requirements?.educationLevel ||
            job.requirements?.minExperienceYears ||
            job.requirements?.maxExperienceYears) && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(job.requirements?.minExperienceYears || job.requirements?.maxExperienceYears) && (
                <RequirementItem
                  value={`${job.requirements.minExperienceYears || 0}${
                    job.requirements.maxExperienceYears
                      ? ` a ${job.requirements.maxExperienceYears}`
                      : ''
                  } anos`}
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                />
              )}

              {job.requirements?.educationLevel && (
                <RequirementItem
                  value={getEducationLevelLabel(
                    job.requirements.educationLevel as EducationLevelEnum,
                  )}
                  icon={<GraduationCap className="h-4 w-4" />}
                />
              )}
            </div>
          )}

        {job.benefits && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <BenefitItem
              enabled={job.benefits.healthInsurance}
              label="Plano de saúde"
              icon={<HeartPulse className="h-4 w-4" />}
            />
            <BenefitItem
              enabled={job.benefits.dentalInsurance}
              label="Odontológico"
              icon={<ShieldPlus className="h-4 w-4" />}
            />
            <BenefitItem
              enabled={job.benefits.alimentationVoucher}
              label="Vale alimentação"
              icon={<Soup className="h-4 w-4" />}
            />
            <BenefitItem
              enabled={job.benefits.transportationVoucher}
              label="Vale transporte"
              icon={<Bus className="h-4 w-4" />}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end">
        {customActions ? (
          <div className="flex flex-wrap gap-2">{customActions}</div>
        ) : !hideDetailsButton ? (
          <Link href={`/jobs/${job._id}`}>
            <Button
              variant="positive"
              icon={<ArrowRight className="h-4 w-4" />}
              className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
            >
              Detalhes
            </Button>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
