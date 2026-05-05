'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { CompanyService } from '@/services/company/company.service';
import { ApiError } from '@/services/http/api-error';
import { CompanyEntity, CompanyStatusEnum } from '@/types/entities/company.entity';
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

function getLanguageLabel(value: LanguagesEnum) {
  return (
    languageOptions.find((option) => option.value === value)?.label || value
  );
}

function getLanguageLevelLabel(value: LanguagesLevelEnum) {
  return (
    languageLevelOptions.find((option) => option.value === value)?.label || value
  );
}

export function RecruiterJobForm({
  mode,
  jobId,
  initialValues,
}: RecruiterJobFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [currentMode, setCurrentMode] = useState<'create' | 'edit'>(
    jobId || initialValues ? 'edit' : mode
  );
  const [currentJobId, setCurrentJobId] = useState<string | undefined>(jobId);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyEntity | null>(null);
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] = useState(false);
  const [languageDraft, setLanguageDraft] = useState<LanguageDraft>({
    name: '',
    level: '',
  });
  const [languagesError, setLanguagesError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LanguageRequirement[]>(
    initialValues?.requirements?.languages || []
  );
  const fieldClassName =
    'mt-2 w-full rounded-xl border border-gray-300 bg-black px-4 py-3 text-gray-300 outline-none placeholder:text-gray-300';
  const disabledFieldClassName =
    `${fieldClassName} disabled:cursor-not-allowed disabled:opacity-100`;
  const checkboxClassName =
    'h-4 w-4 rounded border border-gray-400 bg-black accent-gray-300';
  const hasCompany = Boolean(user?.recruiterProfile?.companyId);
  const companyId = user?.recruiterProfile?.companyId || '';
  const companyName =
    user?.recruiterProfile?.tradeName ||
    user?.recruiterProfile?.company?.tradeName ||
    '';

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
  const contractTypeValue = useWatch({
    control,
    name: 'contractType',
  });
  const previousTitleRef = useRef(titleValue);

  useEffect(() => {
    if (!companyId) {
      return;
    }

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
  }, [companyId]);

  const canPublishJob = hasCompany && companyDetails?.status === CompanyStatusEnum.ACTIVE;

  useEffect(() => {
    if (errors.slug?.type === 'conflict' && previousTitleRef.current !== titleValue) {
      clearErrors('slug');
    }
    previousTitleRef.current = titleValue;
  }, [clearErrors, errors.slug?.type, titleValue]);

  const slugValue =
    !titleValue?.trim()
      ? ''
      : initialValues?.slug && currentMode === 'edit' && !titleValue
      ? initialValues.slug
      : buildJobSlug([
          titleValue || initialValues?.title || '',
          companyDetails?.tradeName || companyName,
          companyDetails?.contacts?.address?.city,
          companyDetails?.contacts?.address?.state,
        ]);
  const slugTitlePart = titleValue?.trim()
    ? buildJobSlug([titleValue])
    : '';
  const slugSuffixPart = slugTitlePart
    ? buildJobSlug([
        companyDetails?.tradeName || companyName,
        companyDetails?.contacts?.address?.city,
        companyDetails?.contacts?.address?.state,
      ])
    : '';

  useEffect(() => {
    setValue('slug', slugValue, {
      shouldValidate: true,
    });
  }, [setValue, slugValue]);

  const hydrateFromJob = useCallback(
    (job: JobEntity) => {
      reset(buildDefaultValues(job));
      setLanguages(job.requirements?.languages || []);
      setLanguagesError(null);
      setCurrentJobId(job._id);
      setCurrentMode('edit');
    },
    [reset]
  );

  const resetToCreateState = useCallback(() => {
    reset(buildDefaultValues());
    setLanguages([]);
    setLanguagesError(null);
    setCurrentJobId(undefined);
    setCurrentMode('create');
  }, [reset]);

  const refreshJobFromMine = useCallback(
    async (targetJobId?: string) => {
      const jobs = await JobService.listMine();
      const selectedJob = targetJobId
        ? jobs.find((item) => item._id === targetJobId)
        : undefined;

      return selectedJob || jobs[0];
    },
    []
  );

  useEffect(() => {
    if (mode !== 'create' || jobId || initialValues) {
      return;
    }

    async function bootstrapFromMine() {
      try {
        const existingJob = await refreshJobFromMine();

        if (existingJob) {
          hydrateFromJob(existingJob);
        }
      } catch {
        // Keep empty create mode when recruiter has no jobs or the fetch fails.
      }
    }

    void bootstrapFromMine();
  }, [hydrateFromJob, initialValues, jobId, mode, refreshJobFromMine]);

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
      companyId,
      slug: slugValue,
      title: data.title,
      description: data.description,
      slots: Number(data.slots),
      contractType: data.contractType,
      requirements: {
        educationLevel: data.educationLevel || undefined,
        minExperienceYears:
          data.minExperienceYears !== undefined &&
          !Number.isNaN(data.minExperienceYears)
            ? Number(data.minExperienceYears)
            : undefined,
        maxExperienceYears:
          data.maxExperienceYears !== undefined &&
          !Number.isNaN(data.maxExperienceYears)
            ? Number(data.maxExperienceYears)
            : undefined,
        languages: languages.length > 0 ? languages : undefined,
      },
      benefits: {
        salary:
          data.salary !== undefined && !Number.isNaN(data.salary)
            ? Number(data.salary)
            : undefined,
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
          const refreshedJobId =
            refreshedJob._id || (refreshedJob as { id?: string }).id;

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
          : 'Não foi possível atualizar a vaga.'
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
    setLanguageDraft({
      name: '',
      level: '',
    });
    setIsLanguageModalOpen(true);
  }

  function handleSaveLanguage() {
    if (!languageDraft.name || !languageDraft.level) {
      showError('Selecione o idioma e o nível para adicionar a língua.');
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
    setLanguages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        className="rounded-2xl border border-gray-500 bg-black p-6"
      >
        {!canPublishJob && !isLoadingCompanyDetails ? (
          <div className="rounded-xl border border-red-100 bg-red-900 p-4 text-sm text-red-100">
            Você precisa cadastrar sua empresa e esperar que ela seja aprovada pela plataforma antes de publicar vagas.
          </div>
        ) : (
          <>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-300">Empresa</label>
              <input
                value={companyName}
                disabled
                className={disabledFieldClassName}
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Tipo de contrato</label>
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
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <MdKeyboardDoubleArrowDown className="h-5 w-5" />
                </span>
              </div>
              {errors.contractType && (
                <p className="mt-1 text-sm text-red-100">
                  {errors.contractType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Slug</label>
              <div
                className={`${disabledFieldClassName} flex min-h-[50px] items-center overflow-hidden break-all ${errors.slug ? 'border-red-100 text-red-100' : ''}`}
              >
                {slugTitlePart ? (
                  <>
                    <span className={errors.slug ? 'text-red-100' : 'text-green-400'}>
                      {slugTitlePart}
                    </span>
                    {slugSuffixPart ? (
                      <span className={errors.slug ? 'text-red-100' : 'text-gray-300'}>
                        {`-${slugSuffixPart}`}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="text-gray-500">Slug será gerado ao preencher o título</span>
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Título</label>
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Descrição</label>
              <textarea
                rows={5}
                className={fieldClassName}
                {...register('description', {
                  required: 'Informe a descrição da vaga.',
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-100">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-300">Quantidade de vagas</label>
              <input
                type="number"
                min={1}
                className={fieldClassName}
                {...register('slots', {
                  required: 'Informe a quantidade de vagas.',
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Informe pelo menos uma vaga.',
                  },
                })}
              />
              {errors.slots && (
                <p className="mt-1 text-sm text-red-100">{errors.slots.message}</p>
              )}
            </div>
            <div className="hidden md:block" />
          </div>

          <fieldset className="rounded-2xl border border-gray-500 p-5">
            <legend className="px-2 text-sm font-semibold uppercase text-gray-100">
              Requirements
            </legend>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-300">Escolaridade</label>
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
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <MdKeyboardDoubleArrowDown className="h-5 w-5" />
                    </span>
                  </div>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-100">
                      {errors.educationLevel.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-gray-300">
                      Experiência mínima
                    </label>
                    <input
                      type="number"
                      min={0}
                      className={fieldClassName}
                      {...register('minExperienceYears', {
                        required: 'Informe a experiência mínima.',
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: 'Informe um valor válido.',
                        },
                      })}
                    />
                    {errors.minExperienceYears && (
                      <p className="mt-1 text-sm text-red-100">
                        {errors.minExperienceYears.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-300">
                      Experiência máxima
                    </label>
                    <input
                      type="number"
                      min={0}
                      className={fieldClassName}
                      {...register('maxExperienceYears', {
                        required: 'Informe a experiência máxima.',
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: 'Informe um valor válido.',
                        },
                      })}
                    />
                    {errors.maxExperienceYears && (
                      <p className="mt-1 text-sm text-red-100">
                        {errors.maxExperienceYears.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Button
                    type="button"
                    variant="profile"
                    icon={<FaPlus />}
                    onClick={handleOpenLanguageModal}
                  >
                    Adicionar língua
                  </Button>
                </div>
                <div className="hidden md:block" />
              </div>

              {languages.length > 0 && (
                <div className="grid gap-3">
                  {languages.map((language, index) => (
                    <article
                      key={`${language.name}-${language.level}-${index}`}
                      className="rounded-2xl border border-gray-500 bg-black p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-100">
                            {getLanguageLabel(language.name)}
                          </p>
                          <p className="mt-1 text-sm text-gray-300">
                            {getLanguageLevelLabel(language.level)}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="danger"
                          icon={<FaTrash />}
                          onClick={() => handleRemoveLanguage(index)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {languagesError && (
                <p className="text-sm text-red-100">{languagesError}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-gray-500 p-5">
            <legend className="px-2 text-sm font-semibold uppercase text-gray-100">
              Benefits
            </legend>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-300">Salário</label>
                  <input
                    type="number"
                    className={fieldClassName}
                    {...register('salary', {
                      required: 'Informe o salário.',
                      valueAsNumber: true,
                    })}
                  />
                  {errors.salary && (
                    <p className="mt-1 text-sm text-red-100">
                      {errors.salary.message}
                    </p>
                  )}
                </div>
                <div className="hidden md:block" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border border-gray-500 px-4 py-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      {...register('healthInsurance')}
                    />
                    <span>Plano de saúde</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-gray-500 px-4 py-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      {...register('dentalInsurance')}
                    />
                    <span>Plano odontológico</span>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border border-gray-500 px-4 py-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      {...register('alimentationVoucher')}
                    />
                    <span>Vale alimentação</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-gray-500 px-4 py-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      {...register('transportationVoucher')}
                    />
                    <span>Vale transporte</span>
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-300">Imagem da vaga</label>
              <input
                className={fieldClassName}
                {...register('coverUrl', {
                  required: 'Informe a imagem da vaga.',
                })}
              />
              {errors.coverUrl && (
                <p className="mt-1 text-sm text-red-100">
                  {errors.coverUrl.message}
                </p>
              )}
            </div>
            <div className="hidden md:block" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {currentJobId && (
            <Button
              type="button"
              variant="danger"
              icon={<FaTrash />}
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
            >
              Deletar vaga
            </Button>
          )}
          <Button
            type="submit"
            variant="positive"
            icon={<FaSave />}
            disabled={isSubmitting || !canPublishJob}
          >
            {currentMode === 'create' ? 'Criar' : 'Atualizar'}
          </Button>
        </div>
          </>
        )}
      </form>

      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <FaPlus className="h-5 w-5 shrink-0" />
                <h2>Adicionar língua</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(false)}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-300">Idioma</label>
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
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <MdKeyboardDoubleArrowDown className="h-5 w-5" />
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Nível</label>
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
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <MdKeyboardDoubleArrowDown className="h-5 w-5" />
                  </span>
                </div>
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button
                  type="button"
                  variant="positive"
                  icon={<FaSave />}
                  onClick={handleSaveLanguage}
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
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <FaTrash className="h-5 w-5 shrink-0" />
                <h2>APAGAR VAGA</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Confirme a exclusão da vaga abaixo.
              </p>

              <div className="grid gap-4 rounded-2xl border border-gray-500 bg-black p-6 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-300">Empresa</label>
                  <input
                    value={companyName}
                    disabled
                    className={disabledFieldClassName}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Tipo de contrato</label>
                  <input
                    value={
                      contractTypeOptions.find(
                        (option) =>
                          option.value ===
                          (contractTypeValue ||
                            (initialValues?.contractType as JobContractTypeEnum))
                      )?.label || ''
                    }
                    disabled
                    className={disabledFieldClassName}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300">Título</label>
                  <input
                    value={titleValue || initialValues?.title || ''}
                    disabled
                    className={disabledFieldClassName}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300">Slug</label>
                  <input
                    value={slugValue}
                    disabled
                    className={disabledFieldClassName}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="profile"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaTrash />}
                  disabled={isSubmitting}
                  onClick={() => {
                    void handleDeleteJob();
                  }}
                >
                  Apagar Vaga
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function buildDefaultValues(job?: JobEntity): RecruiterJobFormValues {
  return {
    contractType:
      (job?.contractType as JobContractTypeEnum) || JobContractTypeEnum.FREELANCE,
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
