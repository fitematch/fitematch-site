import Link from 'next/link';
import { FaArrowRight, FaRegCheckCircle, FaRegCircle, FaGraduationCap } from 'react-icons/fa';
import { FaSchool } from 'react-icons/fa6';
import { MdAttachMoney, MdLanguage } from 'react-icons/md';
import { LiaFileContractSolid } from 'react-icons/lia';
import {
  EducationLevelEnum,
  JobEntity,
  LanguagesEnum,
  LanguagesLevelEnum,
} from '@/types/entities/job.entity';
import { PublicCompanyResponse } from '@/services/company/company.types';
import { Button } from '@/components/ui/button';
import { CARD_STYLES } from '@/constants/styles';
import Image from 'next/image';

interface JobCardProps {
  job: JobEntity;
  company?: PublicCompanyResponse;
  showRequirements?: boolean;
  hideDetailsButton?: boolean;
  customActions?: React.ReactNode;
  hideImageTitleAndLocation?: boolean;
  className?: string;
}

function JobDivider() {
  return (
    <div className="my-4 flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      <div className="h-1.5 w-1.5 rounded-full bg-gray-600/80" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
    </div>
  );
}

function getLanguageLabel(value: LanguagesEnum) {
  return {
    [LanguagesEnum.PORTUGUESE]: 'Português',
    [LanguagesEnum.ENGLISH]: 'Inglês',
    [LanguagesEnum.SPANISH]: 'Espanhol',
  }[value];
}

function getLanguageLevelLabel(value: LanguagesLevelEnum) {
  return {
    [LanguagesLevelEnum.BASIC]: 'Básico',
    [LanguagesLevelEnum.INTERMEDIATE]: 'Intermediário',
    [LanguagesLevelEnum.ADVANCED]: 'Avançado',
    [LanguagesLevelEnum.FLUENT]: 'Fluente',
    [LanguagesLevelEnum.NATIVE]: 'Nativo',
  }[value];
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

export function JobCard({ job, company, showRequirements, hideDetailsButton = false, customActions, hideImageTitleAndLocation = false, className = '' }: JobCardProps) {
  // Prioriza dados vindos de job.company, fallback para prop company
  const jobCompany = (job as { company?: PublicCompanyResponse })?.company;
  const displayCompany = jobCompany || company;
  const educationLevels = job.requirements?.educationLevel;
  // Novo: city e state vêm de company.contacts.address
  const address = displayCompany?.contacts?.address;
  const location = address
    ? [address.city, address.state].filter(Boolean).join(' - ')
    : '';

    // Se for card de listagem (home, jobs): hideDetailsButton === false
    const isListCard = !hideDetailsButton;

    return (
      <article className={`${CARD_STYLES.jobCard} ${isListCard ? 'overflow-hidden' : ''} ${className}`}>
        {/* Imagem de capa com título e localização sobrepostos */}
        {job.media?.coverUrl && (
          <div className="relative -mx-6 -mt-6 mb-0 overflow-hidden rounded-t-xl border-b border-gray-900">
            <Image
              src={job.media.coverUrl}
              alt={job.title}
              width={640}
              height={224}
              unoptimized
              className={`w-full object-cover ${isListCard ? 'h-36' : 'h-44'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/25 to-black/70" />
            {job.contractType && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-gray-200/25 bg-black/80 px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
                <LiaFileContractSolid className="text-base text-gray-100" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  {job.contractType}
                </span>
              </div>
            )}
            {!hideImageTitleAndLocation && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/45 to-transparent px-6 pb-4 pt-10 flex flex-col">
                <span className="text-lg font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                  {job.title}
                </span>
                {location && (
                  <span className="mt-1 text-sm text-gray-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                    {location}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className={`px-1 ${isListCard ? 'pt-3' : 'pt-4'}`}>
          {isListCard ? (
            <>
              <div className="space-y-3">
                {job.slots ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-gray-700 bg-gradient-to-r from-gray-950 to-gray-900 px-3 py-1 text-xs font-semibold text-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      {job.slots === 1 ? '1 vaga disponível' : `${job.slots} vagas disponíveis`}
                    </div>
                    {job.benefits?.salary && (
                      <p className="flex items-center text-sm font-semibold text-green-400">
                        <MdAttachMoney className="mr-1 inline-block text-lg" />
                        {typeof job.benefits.salary === 'string'
                          ? job.benefits.salary
                          : `R$ ${job.benefits.salary.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}`}
                      </p>
                    )}
                  </div>
                ) : null}
                {(educationLevels?.length ||
                  job.requirements?.minExperienceYears ||
                  job.requirements?.maxExperienceYears ||
                  job.requirements?.languages?.length) && (
                  <div className="rounded-2xl border border-gray-800 bg-black/45 px-3 py-3">
                    <ul className="space-y-2 text-xs text-gray-300">
                      {educationLevels?.length ? (
                        <li className="flex items-center gap-2">
                        <FaSchool className="shrink-0 text-gray-400" />
                          <span>
                            {educationLevels
                              .map((level) =>
                                getEducationLevelLabel(level as EducationLevelEnum)
                              )
                              .join(', ')}
                          </span>
                        </li>
                      ) : null}
                      {(job.requirements?.minExperienceYears ||
                        job.requirements?.maxExperienceYears) && (
                        <li className="flex items-center gap-2">
                          <FaGraduationCap className="shrink-0 text-gray-400" />
                          <span>
                            {job.requirements.minExperienceYears || 0}
                            {job.requirements.maxExperienceYears
                              ? ` a ${job.requirements.maxExperienceYears}`
                              : ''}{' '}
                            anos
                          </span>
                        </li>
                      )}
                      {job.requirements?.languages?.map((language) => (
                        <li
                          key={`${language.name}-${language.level}`}
                          className="flex items-center gap-2"
                        >
                          <MdLanguage className="shrink-0 text-gray-400" />
                          <span>
                            {`${getLanguageLabel(language.name)} - ${getLanguageLevelLabel(language.level)}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.benefits && (
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-black/35 px-3 py-2">
                      {job.benefits.healthInsurance ? (
                        <FaRegCheckCircle className="shrink-0 text-green-400" />
                      ) : (
                        <FaRegCircle className="shrink-0 text-gray-500" />
                      )}
                      <span>Plano de saúde</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-black/35 px-3 py-2">
                      {job.benefits.dentalInsurance ? (
                        <FaRegCheckCircle className="shrink-0 text-green-400" />
                      ) : (
                        <FaRegCircle className="shrink-0 text-gray-500" />
                      )}
                      <span>Odontológico</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-black/35 px-3 py-2">
                      {job.benefits.alimentationVoucher ? (
                        <FaRegCheckCircle className="shrink-0 text-green-400" />
                      ) : (
                        <FaRegCircle className="shrink-0 text-gray-500" />
                      )}
                      <span>Vale alimentação</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-black/35 px-3 py-2">
                      {job.benefits.transportationVoucher ? (
                        <FaRegCheckCircle className="shrink-0 text-green-400" />
                      ) : (
                        <FaRegCircle className="shrink-0 text-gray-500" />
                      )}
                      <span>Vale transporte</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {showRequirements && (
                <>
                  <ul className="mb-2 ml-1 space-y-2 text-sm text-gray-200">
                    {educationLevels?.length ? (
                      <li className="flex items-center gap-2">
                        <FaSchool className="text-gray-300" />
                        {educationLevels
                          .map((level) =>
                            getEducationLevelLabel(level as EducationLevelEnum)
                          )
                          .join(', ')}
                      </li>
                    ) : null}
                    {(job.requirements?.minExperienceYears || job.requirements?.maxExperienceYears) && (
                      <li className="flex items-center gap-2">
                        <FaGraduationCap className="text-gray-300" />
                        {job.requirements.minExperienceYears || 0}
                        {job.requirements.maxExperienceYears ? ` a ${job.requirements.maxExperienceYears}` : ''} anos
                      </li>
                    )}
                    {job.requirements?.languages?.map((language) => (
                      <li
                        key={`${language.name}-${language.level}`}
                        className="flex items-center gap-2"
                      >
                        <MdLanguage className="text-gray-300" />
                        {`${getLanguageLabel(language.name)} - ${getLanguageLevelLabel(language.level)}`}
                      </li>
                    ))}
                  </ul>
                  <JobDivider />
                </>
              )}
              <div className="inline-flex items-center rounded-full border border-gray-700 bg-gradient-to-r from-gray-950 to-gray-900 px-3 py-1.5 text-base font-medium text-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                {job.slots === 1 ? '1 vaga disponível' : `${job.slots} vagas disponíveis`}
              </div>
              <JobDivider />
              {job.description && (
                <p className="mt-2 mb-2 whitespace-pre-line text-sm leading-6 text-gray-300">
                  {job.description}
                </p>
              )}
              <JobDivider />
              {/* Tipo de contrato como fallback apenas quando nao houver capa */}
              {job.contractType && !job.media?.coverUrl && (
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gradient-to-r from-gray-950 to-gray-900 px-3 py-1.5 text-xs text-gray-200 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
                  <LiaFileContractSolid className="text-lg text-gray-100" />
                  <p className="uppercase font-bold tracking-[0.12em]">{job.contractType}</p>
                </div>
              )}
              {/* Benefícios */}
              {job.benefits && (
                <div className="mb-2">
                  {/* Salário */}
                  {job.benefits.salary && (
                    <p className="mb-2 flex items-center text-base font-semibold text-green-400">
                      <MdAttachMoney className="mr-1 inline-block text-xl" />
                      {typeof job.benefits.salary === 'string' ? job.benefits.salary : `R$ ${job.benefits.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </p>
                  )}
                  {/* Lista de benefícios (todos, com ícone conforme valor) */}
                  <ul className="ml-1 space-y-2 text-sm text-gray-200">
                    <li className="flex items-center gap-2">
                      {job.benefits.healthInsurance ? (
                        <FaRegCheckCircle className="text-green-400" />
                      ) : (
                        <FaRegCircle className="text-gray-500" />
                      )}
                      Plano de saúde
                    </li>
                    <li className="flex items-center gap-2">
                      {job.benefits.dentalInsurance ? (
                        <FaRegCheckCircle className="text-green-400" />
                      ) : (
                        <FaRegCircle className="text-gray-500" />
                      )}
                      Plano odontológico
                    </li>
                    <li className="flex items-center gap-2">
                      {job.benefits.alimentationVoucher ? (
                        <FaRegCheckCircle className="text-green-400" />
                      ) : (
                        <FaRegCircle className="text-gray-500" />
                      )}
                      Vale alimentação
                    </li>
                    <li className="flex items-center gap-2">
                      {job.benefits.transportationVoucher ? (
                        <FaRegCheckCircle className="text-green-400" />
                      ) : (
                        <FaRegCircle className="text-gray-500" />
                      )}
                      Vale transporte
                    </li>
                  </ul>
                </div>
              )}
              <JobDivider />
            </>
          )}
        </div>

        {/* Rodapé do card: apenas botões customizados, sem logo, nome ou data */}
        <div className="mt-6 flex items-center justify-end px-1">
          {customActions ? (
            <div className="flex gap-2">{customActions}</div>
          ) : !hideDetailsButton ? (
            <Link href={`/jobs/${job._id}`}>
              <Button variant="positive" icon={<FaArrowRight />}>
                Detalhes
              </Button>
            </Link>
          ) : null}
        </div>
      </article>
    );
}
