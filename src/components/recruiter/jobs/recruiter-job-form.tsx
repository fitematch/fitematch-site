'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Bus,
  CheckSquare,
  ChevronDown,
  HeartPulse,
  Languages,
  MinusCircle,
  Plus,
  PlusCircle,
  Save,
  ShieldPlus,
  Soup,
  Square,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { CompanyService } from '@/services/company/company.service';
import { ApiError } from '@/services/http/api-error';
import { UploadService } from '@/services/upload/upload.service';
import { CompanyEntity } from '@/types/entities/company.entity';
import { JobService } from '@/services/job/job.service';
import {
  EducationLevelEnum,
  JobEntity,
  LanguagesEnum,
  LanguagesLevelEnum,
  LanguageRequirement,
} from '@/types/entities/job.entity';
import { buildJobSlug } from '@/utils/slug.utils';

interface RecruiterJobFormProps {
  mode: 'create' | 'edit';
  jobId?: string;
  initialValues?: JobEntity;
}

export enum JobContractTypeEnum {
  CLT = 'clt',
  PJ = 'pj',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary',
  PART_TIME = 'part_time',
  FULL_TIME = 'full_time',
  AUTONOMOUS = 'autonomous',
}

interface RecruiterJobFormValues {
  contractType: JobContractTypeEnum;
  slug: string;
  title: string;
  description: string;
  slots: number;
  educationLevel: EducationLevelEnum | '';
  minExperienceYears?: number;
  maxExperienceYears?: number;
  salary?: number;
  healthInsurance: boolean;
  dentalInsurance: boolean;
  alimentationVoucher: boolean;
  transportationVoucher: boolean;
  coverUrl?: string;
}

interface LanguageDraft {
  name: LanguagesEnum | '';
  level: LanguagesLevelEnum | '';
}

const contractTypeOptions = [
  { value: JobContractTypeEnum.CLT, label: 'CLT' },
  { value: JobContractTypeEnum.PJ, label: 'PJ' },
  { value: JobContractTypeEnum.FREELANCE, label: 'Freelance' },
  { value: JobContractTypeEnum.INTERNSHIP, label: 'Estágio' },
  { value: JobContractTypeEnum.TEMPORARY, label: 'Temporário' },
  { value: JobContractTypeEnum.PART_TIME, label: 'Meio período' },
  { value: JobContractTypeEnum.FULL_TIME, label: 'Tempo integral' },
  { value: JobContractTypeEnum.AUTONOMOUS, label: 'Autônomo' },
];

const educationLevelOptions = [
  { value: EducationLevelEnum.HIGH_SCHOOL, label: 'Ensino Médio' },
  { value: EducationLevelEnum.TECHNICAL, label: 'Técnico' },
  { value: EducationLevelEnum.BACHELOR, label: 'Bacharelado' },
  { value: EducationLevelEnum.ASSOCIATE, label: 'Tecnólogo' },
  { value: EducationLevelEnum.POSTGRADUATE, label: 'Pós-graduação' },
  { value: EducationLevelEnum.MBA, label: 'MBA' },
  { value: EducationLevelEnum.MASTER, label: 'Mestrado' },
  { value: EducationLevelEnum.DOCTORATE, label: 'Doutorado' },
  { value: EducationLevelEnum.EXTENSION, label: 'Extensão' },
  { value: EducationLevelEnum.OTHER, label: 'Outro' },
];

const languageOptions = [
  { value: LanguagesEnum.PORTUGUESE, label: 'Português' },
  { value: LanguagesEnum.ENGLISH, label: 'Inglês' },
  { value: LanguagesEnum.SPANISH, label: 'Espanhol' },
];

const languageLevelOptions = [
  { value: LanguagesLevelEnum.BASIC, label: 'Básico' },
  { value: LanguagesLevelEnum.INTERMEDIATE, label: 'Intermediário' },
  { value: LanguagesLevelEnum.ADVANCED, label: 'Avançado' },
  { value: LanguagesLevelEnum.FLUENT, label: 'Fluente' },
  { value: LanguagesLevelEnum.NATIVE, label: 'Nativo' },
];

function getLanguageLevelLabel(value: LanguagesLevelEnum) {
  return languageLevelOptions.find((option) => option.value === value)?.label || value;
}

function getLanguageRequirement(languages: LanguageRequirement[], name: LanguagesEnum) {
  return languages.find((language) => language.name === name);
}

function normalizeLanguages(languages?: LanguageRequirement[]) {
  const deduped = new Map<LanguagesEnum, LanguageRequirement>();

  for (const language of languages || []) {
    deduped.set(language.name, language);
  }

  deduped.set(LanguagesEnum.PORTUGUESE, {
    name: LanguagesEnum.PORTUGUESE,
    level: LanguagesLevelEnum.NATIVE,
  });

  return Array.from(deduped.values());
}

function formatCurrencyInput(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return 'R$ ';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return undefined;
  }

  return Number(digits) / 100;
}

function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  error,
}: {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  error?: string;
}) {
  const canDecrease = (value ?? min) > min;
  const activeButtonClassName =
    'cursor-pointer border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15';
  const inactiveButtonClassName =
    'cursor-not-allowed border-lime-500/10 bg-lime-500/5 text-lime-300/50';

  return (
    <div>
      <label className="text-sm text-zinc-300">{label}</label>
      <div className="relative mt-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, (value ?? min) - 1))}
          className={`absolute left-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl border transition-all duration-300 ${
            canDecrease ? activeButtonClassName : inactiveButtonClassName
          }`}
          aria-label={`Diminuir ${label}`}
          disabled={!canDecrease}
        >
          <MinusCircle className="h-4 w-4" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value ?? min}
          onChange={(event) => {
            const nextValue = Number(event.target.value.replace(/\D/g, ''));
            onChange(Number.isNaN(nextValue) ? min : Math.max(min, nextValue));
          }}
          className="mt-0 h-[50px] w-full rounded-xl border border-zinc-800 bg-zinc-950 px-12 py-3 text-center text-zinc-200 outline-none placeholder:text-zinc-500"
        />
        <button
          type="button"
          onClick={() => onChange((value ?? min) + 1)}
          className={`absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl border transition-all duration-300 ${activeButtonClassName}`}
          aria-label={`Aumentar ${label}`}
        >
          <PlusCircle className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-100">{error}</p>}
    </div>
  );
}

function BenefitCheckbox({
  label,
  description,
  icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-4 text-zinc-300 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:bg-zinc-950/90">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
          checked
            ? 'border-lime-500/20 bg-lime-500/10 text-lime-300'
            : 'border-zinc-800 bg-black/40 text-zinc-400'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-100">{label}</p>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
      <div className={`shrink-0 transition ${checked ? 'text-lime-400' : 'text-zinc-500'}`}>
        {checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
      </div>
    </label>
  );
}

export function RecruiterJobForm({ mode, jobId, initialValues }: RecruiterJobFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [currentMode, setCurrentMode] = useState<'create' | 'edit'>(
    jobId || initialValues ? 'edit' : mode,
  );
  const [currentJobId, setCurrentJobId] = useState<string | undefined>(jobId);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasConfirmedDelete, setHasConfirmedDelete] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyEntity | null>(null);
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] = useState(false);
  const [languageDraft, setLanguageDraft] = useState<LanguageDraft>({
    name: '',
    level: '',
  });
  const [languagesError, setLanguagesError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LanguageRequirement[]>(
    normalizeLanguages(initialValues?.requirements?.languages),
  );
  const fieldClassName =
    'mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-200 outline-none placeholder:text-zinc-500';
  const disabledFieldClassName = `${fieldClassName} disabled:cursor-not-allowed disabled:opacity-100`;
  const recruiterCompanyId = user?.recruiterProfile?.companyId || '';
  const companyName =
    user?.recruiterProfile?.tradeName || user?.recruiterProfile?.company?.tradeName || '';
  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterJobFormValues>({
    defaultValues: buildDefaultValues(initialValues),
  });
  const titleValue = useWatch({
    control,
    name: 'title',
  });
  const slotsValue = useWatch({
    control,
    name: 'slots',
  });
  const contractTypeValue = useWatch({
    control,
    name: 'contractType',
  });
  const minExperienceYearsValue = useWatch({
    control,
    name: 'minExperienceYears',
  });
  const maxExperienceYearsValue = useWatch({
    control,
    name: 'maxExperienceYears',
  });
  const salaryValue = useWatch({
    control,
    name: 'salary',
  });
  const descriptionValue = useWatch({
    control,
    name: 'description',
  });
  const healthInsuranceValue = useWatch({
    control,
    name: 'healthInsurance',
  });
  const dentalInsuranceValue = useWatch({
    control,
    name: 'dentalInsurance',
  });
  const alimentationVoucherValue = useWatch({
    control,
    name: 'alimentationVoucher',
  });
  const transportationVoucherValue = useWatch({
    control,
    name: 'transportationVoucher',
  });
  const coverUrlValue = useWatch({
    control,
    name: 'coverUrl',
  });
  const previousTitleRef = useRef(titleValue);
  const salaryInputRef = useRef<HTMLInputElement | null>(null);
  const availableLanguageOptions = languageOptions.filter(
    (option) => !languages.some((language) => language.name === option.value),
  );
  const descriptionMaxLength = 140;
  const descriptionRemainingCharacters = descriptionMaxLength - (descriptionValue?.length || 0);

  const moveSalaryCaretToCurrencyEnd = useCallback(() => {
    const input = salaryInputRef.current;

    if (!input) {
      return;
    }

    const currencyPrefixIndex = input.value.indexOf('$');
    const caretPosition = currencyPrefixIndex >= 0 ? currencyPrefixIndex + 2 : 3;

    requestAnimationFrame(() => {
      input.setSelectionRange(caretPosition, caretPosition);
    });
  }, []);

  useEffect(() => {
    async function loadCompanyDetails() {
      setIsLoadingCompanyDetails(true);
      try {
        const company = await CompanyService.readMine();
        setCompanyDetails(company);
      } catch {
        setCompanyDetails(null);
      } finally {
        setIsLoadingCompanyDetails(false);
      }
    }

    void loadCompanyDetails();
  }, []);

  const resolvedCompanyId = companyDetails?._id || recruiterCompanyId;
  const hasCompany = Boolean(resolvedCompanyId);
  const canPublishJob = hasCompany;

  useEffect(() => {
    if (errors.slug?.type === 'conflict' && previousTitleRef.current !== titleValue) {
      clearErrors('slug');
    }
    previousTitleRef.current = titleValue;
  }, [clearErrors, errors.slug?.type, titleValue]);

  const slugValue = !titleValue?.trim()
    ? ''
    : initialValues?.slug && currentMode === 'edit' && !titleValue
      ? initialValues.slug
      : buildJobSlug([
          companyDetails?.tradeName || companyName,
          companyDetails?.contacts?.address?.city,
          titleValue || initialValues?.title || '',
        ]);
  const slugPrefixPart = buildJobSlug([
    companyDetails?.tradeName || companyName,
    companyDetails?.contacts?.address?.city,
  ]);
  const slugTitlePart = titleValue?.trim() ? buildJobSlug([titleValue]) : '';

  useEffect(() => {
    setValue('slug', slugValue, {
      shouldValidate: true,
    });
  }, [setValue, slugValue]);

  const hydrateFromJob = useCallback(
    (job: JobEntity) => {
      reset(buildDefaultValues(job));
      setLanguages(normalizeLanguages(job.requirements?.languages));
      setLanguagesError(null);
      setCurrentJobId(job._id);
      setCurrentMode('edit');
    },
    [reset],
  );

  const resetToCreateState = useCallback(() => {
    reset(buildDefaultValues());
    setLanguages(normalizeLanguages());
    setLanguagesError(null);
    setCurrentJobId(undefined);
    setCurrentMode('create');
  }, [reset]);

  const refreshJobFromMine = useCallback(async (targetJobId?: string) => {
    const jobs = await JobService.listMine();
    const selectedJob = targetJobId ? jobs.find((item) => item._id === targetJobId) : undefined;

    return selectedJob || jobs[0];
  }, []);

  async function onSubmit(data: RecruiterJobFormValues) {
    if (!hasCompany) {
      showError('Cadastre sua empresa antes de publicar vagas.');
      return;
    }

    if (languages.length === 0) {
      setLanguagesError('Adicione pelo menos uma língua.');
      showError('Preencha todos os campos obrigatórios da vaga.');
      return;
    }

    const basePayload = {
      companyId: resolvedCompanyId,
      slug: slugValue,
      title: data.title,
      description: data.description,
      slots: Number(data.slots),
      contractType: data.contractType,
      requirements: {
        educationLevel: data.educationLevel || undefined,
        minExperienceYears:
          data.minExperienceYears !== undefined && !Number.isNaN(data.minExperienceYears)
            ? Number(data.minExperienceYears)
            : undefined,
        maxExperienceYears:
          data.maxExperienceYears !== undefined && !Number.isNaN(data.maxExperienceYears)
            ? Number(data.maxExperienceYears)
            : undefined,
        languages: languages.length > 0 ? languages : undefined,
      },
      benefits: {
        salary:
          data.salary !== undefined && !Number.isNaN(data.salary) ? Number(data.salary) : undefined,
        healthInsurance: data.healthInsurance,
        dentalInsurance: data.dentalInsurance,
        alimentationVoucher: data.alimentationVoucher,
        transportationVoucher: data.transportationVoucher,
      },
      media: {
        coverUrl: data.coverUrl,
      },
    };

    try {
      if (currentMode === 'create') {
        const createdJob = await JobService.createMine(basePayload);
        const createdJobId = createdJob._id || (createdJob as { id?: string }).id;
        const refreshedJob = await refreshJobFromMine(createdJobId);

        if (refreshedJob) {
          hydrateFromJob(refreshedJob);
          const refreshedJobId = refreshedJob._id || (refreshedJob as { id?: string }).id;

          if (refreshedJobId) {
            router.push(ROUTES.RECRUITER_EDIT_JOB(refreshedJobId));
            router.refresh();
          }
        }

        showSuccess('Vaga criada com sucesso e enviada para aprovação.');
        return;
      }

      if (currentMode === 'edit' && currentJobId) {
        await JobService.updateMine(currentJobId, basePayload);
        const refreshedJob = await refreshJobFromMine(currentJobId);

        if (refreshedJob) {
          hydrateFromJob(refreshedJob);
        }

        showSuccess('Vaga atualizada com sucesso.');
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 409) {
        setError('slug', {
          type: 'conflict',
          message: 'Já existe uma vaga com este slug. Altere o título para gerar outro slug.',
        });
        return;
      }

      showError(
        currentMode === 'create'
          ? 'Não foi possível criar a vaga.'
          : 'Não foi possível atualizar a vaga.',
      );
    }
  }

  function onInvalidSubmit(formErrors: FieldErrors<RecruiterJobFormValues>) {
    if (Object.keys(formErrors).length > 0 || languages.length === 0) {
      if (languages.length === 0) {
        setLanguagesError('Adicione pelo menos uma língua.');
      }

      showError('Preencha todos os campos obrigatórios da vaga.');
    }
  }

  async function handleDeleteJob() {
    if (!currentJobId) {
      return;
    }

    try {
      await JobService.deleteMine(currentJobId);
      showSuccess('Vaga removida com sucesso.');
      setIsDeleteModalOpen(false);

      if (jobId) {
        router.push(ROUTES.RECRUITER_JOBS);
        router.refresh();
        return;
      }

      resetToCreateState();
      router.refresh();
    } catch {
      showError('Não foi possível remover a vaga.');
    }
  }

  function handleOpenLanguageModal() {
    if (availableLanguageOptions.length === 0) {
      showError('Todos os idiomas disponíveis já foram adicionados.');
      return;
    }

    setLanguageDraft({
      name: availableLanguageOptions[0]?.value || '',
      level: '',
    });
    setIsLanguageModalOpen(true);
  }

  function handleSaveLanguage() {
    if (!languageDraft.name || !languageDraft.level) {
      showError('Selecione o idioma e o nível para adicionar a língua.');
      return;
    }

    if (languages.some((language) => language.name === languageDraft.name)) {
      showError('Esse idioma já foi adicionado.');
      return;
    }

    setLanguages((current) => [
      ...current,
      {
        name: languageDraft.name as LanguagesEnum,
        level: languageDraft.level as LanguagesLevelEnum,
      },
    ]);
    setLanguagesError(null);
    setIsLanguageModalOpen(false);
  }

  function handleRemoveLanguage(index: number) {
    if (languages[index]?.name === LanguagesEnum.PORTUGUESE) {
      showError('Português nativo é obrigatório e não pode ser removido.');
      return;
    }

    setLanguages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  const summaryCards = [
    {
      label: 'Empresa',
      value: companyDetails?.tradeName || companyName || 'Sem empresa',
      helper: 'Publicação vinculada à operação ativa',
      icon: <BriefcaseBusiness className="h-4 w-4" />,
    },
    {
      label: 'Contrato',
      value:
        contractTypeOptions.find((option) => option.value === contractTypeValue)?.label ||
        'Não definido',
      helper: 'Modelo principal da contratação',
      icon: <ShieldPlus className="h-4 w-4" />,
    },
    {
      label: 'Vagas',
      value: String(slotsValue || 1),
      helper: 'Quantidade de posições abertas',
      icon: <Plus className="h-4 w-4" />,
    },
    {
      label: 'Idiomas',
      value: `${languages.length}`,
      helper: 'Requisitos linguísticos cadastrados',
      icon: <Languages className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {isLoadingCompanyDetails && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-40 rounded-2xl border border-zinc-800 bg-zinc-950/80"
                />
              ))}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
              <div className="space-y-5">
                <Skeleton className="h-8 w-64 rounded-xl bg-black/50" />
                <Skeleton className="h-28 rounded-2xl bg-black/50" />
                <Skeleton className="h-28 rounded-2xl bg-black/50" />
                <Skeleton className="h-28 rounded-2xl bg-black/50" />
              </div>
            </div>
          </div>
        )}

        {!isLoadingCompanyDetails && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.04 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                    {item.icon}
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">
                    {item.label}
                  </span>
                </div>
                <p className="mt-6 truncate text-2xl font-semibold tracking-[-0.04em] text-zinc-50">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-zinc-500">{item.helper}</p>
              </motion.div>
            ))}
          </section>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur"
        >
          {!canPublishJob && !isLoadingCompanyDetails ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
              Você precisa cadastrar sua empresa antes de publicar vagas.
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-3 text-zinc-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                      <BriefcaseBusiness className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-50">
                        {currentMode === 'create' ? 'Configuração da vaga' : 'Edição da vaga'}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        Estruture os detalhes da publicação, requisitos e benefícios com o padrão do
                        dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FileUpload
                    label="Imagem da vaga"
                    accept="image/*"
                    value={coverUrlValue}
                    cropAspectRatio={20 / 7}
                    onUpload={async (file) => {
                      const response = await UploadService.uploadJobCover(file);

                      setValue('coverUrl', response.url, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });

                      return response.url;
                    }}
                  />
                  <input
                    type="hidden"
                    {...register('coverUrl', {
                      required: 'Informe a imagem da vaga.',
                    })}
                  />
                  {errors.coverUrl && (
                    <p className="mt-1 text-sm text-red-100">{errors.coverUrl.message}</p>
                  )}
                </div>
                <div className="hidden md:block" />
                <div>
                  <label className="text-sm text-zinc-300">Título</label>
                  <input
                    className={fieldClassName}
                    {...register('title', {
                      required: 'Informe o título da vaga.',
                    })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-100">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-zinc-300">Slug</label>
                  <div
                    className={`${disabledFieldClassName} flex min-h-[50px] items-center overflow-hidden break-all ${errors.slug ? 'border-red-500/30 text-red-200' : ''}`}
                  >
                    {slugPrefixPart ? (
                      <>
                        <span className={errors.slug ? 'text-red-200' : 'text-zinc-300'}>
                          {slugPrefixPart}
                        </span>
                        {slugTitlePart ? (
                          <span className={errors.slug ? 'text-red-200' : 'text-lime-400'}>
                            {`-${slugTitlePart}`}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-zinc-500">Slug será gerado ao preencher o título</span>
                    )}
                  </div>
                  <input
                    type="hidden"
                    {...register('slug', {
                      required: 'Slug não gerado.',
                    })}
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-100">{errors.slug.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-zinc-300">Descrição</label>
                  <textarea
                    rows={5}
                    maxLength={descriptionMaxLength}
                    className={fieldClassName}
                    {...register('description', {
                      required: 'Informe a descrição da vaga.',
                      maxLength: {
                        value: descriptionMaxLength,
                        message: `A descrição deve ter no máximo ${descriptionMaxLength} caracteres.`,
                      },
                    })}
                  />
                  <p className="mt-2 text-right text-xs text-zinc-500">
                    {descriptionRemainingCharacters} caracteres restantes
                  </p>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-100">{errors.description.message}</p>
                  )}
                </div>

                <fieldset className="rounded-2xl border border-zinc-800 bg-black/30 p-5 md:col-span-2">
                  <legend className="px-2 text-sm font-semibold uppercase text-zinc-100">
                    Requisitos
                  </legend>

                  <div className="grid gap-4">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm text-zinc-300">Tipo de contrato</label>
                          <div className="relative">
                            <select
                              className={`${fieldClassName} appearance-none pr-12`}
                              {...register('contractType', {
                                required: 'Informe o tipo de contrato.',
                              })}
                            >
                              {contractTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                              <ChevronDown className="h-5 w-5" />
                            </span>
                          </div>
                          {errors.contractType && (
                            <p className="mt-1 text-sm text-red-100">
                              {errors.contractType.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            type="hidden"
                            {...register('slots', {
                              required: 'Informe a quantidade de vagas.',
                              valueAsNumber: true,
                              min: {
                                value: 1,
                                message: 'Informe pelo menos uma vaga.',
                              },
                            })}
                          />
                          <NumberStepper
                            label="Quantidade de vagas"
                            value={slotsValue}
                            min={1}
                            onChange={(value) =>
                              setValue('slots', value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                            error={errors.slots?.message}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <input
                            type="hidden"
                            {...register('minExperienceYears', {
                              required: 'Informe a experiência mínima.',
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: 'Informe um valor válido.',
                              },
                            })}
                          />
                          <NumberStepper
                            label="Experiência mínima"
                            value={minExperienceYearsValue}
                            min={0}
                            onChange={(value) =>
                              setValue('minExperienceYears', value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                            error={errors.minExperienceYears?.message}
                          />
                        </div>

                        <div>
                          <input
                            type="hidden"
                            {...register('maxExperienceYears', {
                              required: 'Informe a experiência máxima.',
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: 'Informe um valor válido.',
                              },
                            })}
                          />
                          <NumberStepper
                            label="Experiência máxima"
                            value={maxExperienceYearsValue}
                            min={0}
                            onChange={(value) =>
                              setValue('maxExperienceYears', value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                            error={errors.maxExperienceYears?.message}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm text-zinc-300">Escolaridade</label>
                          <div className="relative">
                            <select
                              className={`${fieldClassName} appearance-none pr-12`}
                              {...register('educationLevel', {
                                required: 'Informe a escolaridade.',
                              })}
                            >
                              <option value="">Selecione</option>
                              {educationLevelOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                              <ChevronDown className="h-5 w-5" />
                            </span>
                          </div>
                          {errors.educationLevel && (
                            <p className="mt-1 text-sm text-red-100">
                              {errors.educationLevel.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm text-transparent select-none">Acao</label>
                          <Button
                            type="button"
                            variant="profile"
                            icon={<Plus className="h-4 w-4" />}
                            onClick={handleOpenLanguageModal}
                            className="mt-2 inline-flex h-[50px] items-center rounded-xl bg-gray-100 px-4 py-3 text-black hover:bg-gray-300"
                          >
                            Adicionar língua
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          {languageOptions.map((option) => {
                            const language = getLanguageRequirement(languages, option.value);
                            const languageIndex = languages.findIndex(
                              (item) => item.name === option.value,
                            );
                            const isActive = Boolean(language);

                            return (
                              <article
                                key={option.value}
                                className={`rounded-2xl border p-4 backdrop-blur transition-all ${
                                  isActive
                                    ? 'border-lime-500/20 bg-lime-500/10'
                                    : 'border-zinc-900 bg-zinc-950/30'
                                }`}
                              >
                                <div className="flex h-full flex-col justify-between gap-4">
                                  <div>
                                    <p
                                      className={`text-sm font-semibold ${
                                        isActive ? 'text-lime-300' : 'text-zinc-600'
                                      }`}
                                    >
                                      {option.label}
                                    </p>
                                    <p
                                      className={`mt-1 text-sm ${
                                        isActive ? 'text-lime-200' : 'text-zinc-700'
                                      }`}
                                    >
                                      {language
                                        ? getLanguageLevelLabel(language.level)
                                        : 'Não adicionado'}
                                    </p>
                                  </div>

                                  {isActive && option.value !== LanguagesEnum.PORTUGUESE ? (
                                    <Button
                                      type="button"
                                      variant="danger"
                                      icon={<Trash2 className="h-4 w-4" />}
                                      onClick={() => handleRemoveLanguage(languageIndex)}
                                      className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                                    >
                                      Deletar
                                    </Button>
                                  ) : null}
                                </div>
                              </article>
                            );
                          })}
                        </div>

                        {languagesError && <p className="text-sm text-red-100">{languagesError}</p>}
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="rounded-2xl border border-zinc-800 bg-black/30 p-5 md:col-span-2">
                  <legend className="px-2 text-sm font-semibold uppercase text-zinc-100">
                    Benefits
                  </legend>

                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm text-zinc-300">Salário</label>
                        <input
                          type="hidden"
                          {...register('salary', {
                            required: 'Informe o salário.',
                            valueAsNumber: true,
                          })}
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          className={fieldClassName}
                          value={formatCurrencyInput(salaryValue)}
                          ref={salaryInputRef}
                          onFocus={moveSalaryCaretToCurrencyEnd}
                          onClick={moveSalaryCaretToCurrencyEnd}
                          onChange={(event) => {
                            setValue('salary', parseCurrencyInput(event.target.value), {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                        {errors.salary && (
                          <p className="mt-1 text-sm text-red-100">{errors.salary.message}</p>
                        )}
                      </div>
                      <div className="hidden md:block" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <BenefitCheckbox
                        label="Plano de saúde"
                        description="Cobertura médica para os colaboradores."
                        icon={<HeartPulse className="h-6 w-6" />}
                        checked={Boolean(healthInsuranceValue)}
                        onChange={(checked) =>
                          setValue('healthInsurance', checked, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <BenefitCheckbox
                        label="Plano odontológico"
                        description="Assistência odontológica como benefício."
                        icon={<ShieldPlus className="h-6 w-6" />}
                        checked={Boolean(dentalInsuranceValue)}
                        onChange={(checked) =>
                          setValue('dentalInsurance', checked, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <BenefitCheckbox
                        label="Vale alimentação"
                        description="Apoio no custo de alimentação do dia a dia."
                        icon={<Soup className="h-6 w-6" />}
                        checked={Boolean(alimentationVoucherValue)}
                        onChange={(checked) =>
                          setValue('alimentationVoucher', checked, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <BenefitCheckbox
                        label="Vale transporte"
                        description="Auxílio de deslocamento para o trabalho."
                        icon={<Bus className="h-5 w-5" />}
                        checked={Boolean(transportationVoucherValue)}
                        onChange={(checked) =>
                          setValue('transportationVoucher', checked, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                {currentJobId && (
                  <Button
                    type="button"
                    variant="danger"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => {
                      setHasConfirmedDelete(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                  >
                    Deletar vaga
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="positive"
                  icon={<Save className="h-4 w-4" />}
                  disabled={isSubmitting || !canPublishJob}
                  className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
                >
                  {currentMode === 'create' ? 'Criar' : 'Atualizar'}
                </Button>
              </div>
            </>
          )}
        </form>

        {isLanguageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 text-xl font-semibold uppercase text-zinc-100">
                  <Plus className="h-5 w-5 shrink-0 text-lime-400" />
                  <h2>Adicionar língua</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="text-2xl leading-none text-zinc-400 transition-colors hover:text-zinc-100"
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-zinc-300">Idioma</label>
                  <div className="relative">
                    <select
                      value={languageDraft.name}
                      onChange={(event) =>
                        setLanguageDraft((current) => ({
                          ...current,
                          name: event.target.value as LanguagesEnum | '',
                        }))
                      }
                      className={`${fieldClassName} appearance-none pr-12`}
                    >
                      <option value="">Selecione</option>
                      {availableLanguageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      <ChevronDown className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-zinc-300">Nível</label>
                  <div className="relative">
                    <select
                      value={languageDraft.level}
                      onChange={(event) =>
                        setLanguageDraft((current) => ({
                          ...current,
                          level: event.target.value as LanguagesLevelEnum | '',
                        }))
                      }
                      className={`${fieldClassName} appearance-none pr-12`}
                    >
                      <option value="">Selecione</option>
                      {languageLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      <ChevronDown className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                <div className="flex justify-end md:col-span-2">
                  <Button
                    type="button"
                    variant="positive"
                    icon={<Save className="h-4 w-4" />}
                    onClick={handleSaveLanguage}
                    className="rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 text-xl font-semibold uppercase text-zinc-100">
                  <Trash2 className="h-5 w-5 shrink-0 text-red-300" />
                  <h2>APAGAR VAGA</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHasConfirmedDelete(false);
                    setIsDeleteModalOpen(false);
                  }}
                  className="text-2xl leading-none text-zinc-400 transition-colors hover:text-zinc-100"
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300">
                  {`Deseja realmente deletar a vaga ${titleValue || initialValues?.title || ''}?`}
                </p>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                  <p className="text-sm text-red-200">
                    Ao deletar a vaga, não será possível reativá-la posteriormente. Os dados dos
                    candidatos aplicados também serão perdidos de forma definitiva.
                  </p>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-zinc-700 bg-black accent-lime-400"
                    checked={hasConfirmedDelete}
                    onChange={(event) => setHasConfirmedDelete(event.target.checked)}
                  />
                  <span>Confirmo que desejo deletar esta vaga permanentemente.</span>
                </label>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="profile"
                    onClick={() => {
                      setHasConfirmedDelete(false);
                      setIsDeleteModalOpen(false);
                    }}
                    className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    icon={<Trash2 className="h-4 w-4" />}
                    disabled={isSubmitting || !hasConfirmedDelete}
                    onClick={() => {
                      void handleDeleteJob();
                    }}
                    className="rounded-xl border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                  >
                    Apagar Vaga
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function buildDefaultValues(job?: JobEntity): RecruiterJobFormValues {
  return {
    contractType: (job?.contractType as JobContractTypeEnum) || JobContractTypeEnum.FREELANCE,
    slug: job?.slug || '',
    title: job?.title || '',
    description: job?.description || '',
    slots: job?.slots || 1,
    educationLevel: job?.requirements?.educationLevel || '',
    minExperienceYears: job?.requirements?.minExperienceYears,
    maxExperienceYears: job?.requirements?.maxExperienceYears,
    salary: job?.benefits?.salary,
    healthInsurance: Boolean(job?.benefits?.healthInsurance),
    dentalInsurance: Boolean(job?.benefits?.dentalInsurance),
    alimentationVoucher: Boolean(job?.benefits?.alimentationVoucher),
    transportationVoucher: Boolean(job?.benefits?.transportationVoucher),
    coverUrl: job?.media?.coverUrl || '',
  };
}
