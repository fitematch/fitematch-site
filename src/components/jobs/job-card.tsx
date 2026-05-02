import Link from 'next/link';
import { FaArrowRight, FaRegCheckCircle, FaRegCircle, FaGraduationCap } from 'react-icons/fa';
import { FaSchool } from 'react-icons/fa6';
import { TiMinus } from 'react-icons/ti';
import { MdAttachMoney } from 'react-icons/md';
import { LiaFileContractSolid } from 'react-icons/lia';
import { JobEntity } from '@/types/entities/job.entity';
import { PublicCompanyResponse } from '@/services/company/company.types';
import { Button } from '@/components/ui/button';
import { CARD_STYLES, TEXT_STYLES } from '@/constants/styles';
import Image from 'next/image';

interface JobCardProps {
  job: JobEntity;
  company?: PublicCompanyResponse;
  showRequirements?: boolean;
  hideDetailsButton?: boolean;
  customActions?: React.ReactNode;
  hideImageTitleAndLocation?: boolean;
}


export function JobCard({ job, company, showRequirements, hideDetailsButton = false, customActions, hideImageTitleAndLocation = false }: JobCardProps) {
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
      <article className={CARD_STYLES.jobCard}>
        {/* Imagem de capa com título e localização sobrepostos */}
        {job.media?.coverUrl && (
          <div className="relative -mx-6 -mt-6 mb-0 overflow-hidden rounded-t-xl border-b border-gray-900">
            <Image
              src={job.media.coverUrl}
              alt={job.title}
              width={640}
              height={224}
              unoptimized
              className="w-full h-44 object-cover"
            />
            {!hideImageTitleAndLocation && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-6 pb-3 pt-8 flex flex-col">
                <span className="text-lg font-bold text-white drop-shadow-md">{job.title}</span>
                {location && (
                  <span className="text-sm text-gray-200 drop-shadow-md mt-1">{location}</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="px-1 pt-4">
          {isListCard ? (
            <>
              {/* ContractType, hífen e slots na mesma linha */}
              {(job.contractType || job.slots) && (
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-300">
                  {job.contractType && <><LiaFileContractSolid className="text-lg text-primary" /><span className="uppercase font-bold">{job.contractType}</span></>}
                  <span>-</span>
                  <span className="text-base font-medium text-gray-200">
                    {job.slots === 1 ? '1 vaga disponível' : `${job.slots} vagas disponíveis`}
                  </span>
                </div>
              )}
              <hr className="my-3 border-green-100" />
              {/* Apenas salário dos benefícios */}
              {job.benefits?.salary && (
                <p className="flex items-center text-sm text-green-400 font-semibold mb-2">
                  <MdAttachMoney className="inline-block mr-1 text-lg" />
                  {typeof job.benefits.salary === 'string' ? job.benefits.salary : `R$ ${job.benefits.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
              )}
              {(educationLevels?.length || job.requirements?.minExperienceYears || job.requirements?.maxExperienceYears) && (
                <ul className="mb-2 text-xs text-gray-300 space-y-1 ml-1">
                  {educationLevels?.length ? (
                    <li className="flex items-center gap-2">
                      <FaSchool className="text-gray-400" />
                      {educationLevels.map((level) => String(level).toUpperCase()).join(', ')}
                    </li>
                  ) : null}
                  {(job.requirements?.minExperienceYears || job.requirements?.maxExperienceYears) && (
                    <li className="flex items-center gap-2">
                      <FaGraduationCap className="text-gray-400" />
                      {job.requirements.minExperienceYears || 0}{job.requirements.maxExperienceYears ? ` a ${job.requirements.maxExperienceYears}` : ''} anos
                    </li>
                  )}
                </ul>
              )}
              <hr className="my-3 border-green-100" />
            </>
          ) : (
            <>
              {showRequirements && (
                <>
                  <ul className="mb-2 text-xs text-gray-300 space-y-1 ml-1">
                    {educationLevels?.length ? (
                      <li className="flex items-center gap-2">
                        <TiMinus className="text-gray-400" />
                        {educationLevels.map((level) => String(level).toUpperCase()).join(', ')}
                      </li>
                    ) : null}
                    {(job.requirements?.minExperienceYears || job.requirements?.maxExperienceYears) && (
                      <li className="flex items-center gap-2">
                        <TiMinus className="text-gray-400" />
                        {job.requirements.minExperienceYears || 0}
                        {job.requirements.maxExperienceYears ? ` a ${job.requirements.maxExperienceYears}` : ''} anos
                      </li>
                    )}
                  </ul>
                  <hr className="my-3 border-green-100" />
                </>
              )}
              <p className={`text-base font-medium ${TEXT_STYLES.jobCardText}`}>
                {job.slots === 1 ? '1 vaga disponível' : `${job.slots} vagas disponíveis`}
              </p>
              <hr className="my-3 border-green-100" />
              {job.description && (
                <p className="text-xs text-gray-400 mt-2 mb-2 whitespace-pre-line">{job.description}</p>
              )}
              <hr className="my-3 border-green-100" />
              {/* Tipo de contrato */}
              {job.contractType && (
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-300">
                  <LiaFileContractSolid className="text-lg text-primary" />
                  <p className="uppercase bold">{job.contractType}</p>
                </div>
              )}
              {/* Benefícios */}
              {job.benefits && (
                <div className="mb-2">
                  {/* Salário */}
                  {job.benefits.salary && (
                    <p className="flex items-center text-sm text-green-400 font-semibold mb-1">
                      <MdAttachMoney className="inline-block mr-1 text-lg" />
                      {typeof job.benefits.salary === 'string' ? job.benefits.salary : `R$ ${job.benefits.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </p>
                  )}
                  {/* Lista de benefícios (todos, com ícone conforme valor) */}
                  <ul className="text-xs text-gray-300 space-y-1 ml-1">
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
              <hr className="my-3 border-green-100" />
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
