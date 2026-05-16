'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { BadgeCheck, Building2, Globe, Landmark, MapPin, Save } from 'lucide-react';
import { PhoneInput } from '@/components/form/phone-input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAddressByZipCode } from '@/hooks/use-address-by-zipcode';
import { useCompanyByCnpj } from '@/hooks/use-company-by-cnpj';
import { CompanyService } from '@/services/company/company.service';
import { ApiError } from '@/services/http/api-error';
import { UploadService } from '@/services/upload/upload.service';
import { CompanyEntity } from '@/types/entities/company.entity';

interface RecruiterCompanyFormValues {
  tradeName: string;
  legalName: string;
  email: string;
  website?: string;
  phoneCountry: string;
  phoneNumber: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  cnpj: string;
  logoUrl?: string;
}

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }

  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function SummaryCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      </div>
      <p className="mt-6 truncate text-2xl font-semibold tracking-[-0.04em] text-zinc-50">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </motion.div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
      className="rounded-2xl border border-zinc-800 bg-black/30 p-5"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          {icon}
        </div>
        <div>
          <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-100">
            {title}
          </legend>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      {children}
    </motion.fieldset>
  );
}

function LoadingState() {
  return (
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
          <Skeleton className="h-8 w-56 rounded-xl bg-black/50" />
          <Skeleton className="h-28 rounded-2xl bg-black/50" />
          <Skeleton className="h-28 rounded-2xl bg-black/50" />
          <Skeleton className="h-28 rounded-2xl bg-black/50" />
        </div>
      </div>
    </div>
  );
}

export function RecruiterCompanyForm() {
  const { showSuccess, showError } = useFlashMessage();
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [hasCompany, setHasCompany] = useState(false);
  const {
    searchCompanyByCnpj,
    clearError: clearCnpjError,
    isLoading: isCnpjLoading,
    error: cnpjError,
  } = useCompanyByCnpj();
  const {
    searchZipCode,
    clearError: clearZipCodeError,
    isLoading: isZipCodeLoading,
    error: zipCodeError,
  } = useAddressByZipCode();

  const labelClassName = 'text-zinc-300';
  const fieldClassName =
    'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterCompanyFormValues>({
    defaultValues: {
      phoneCountry: '+55',
      country: 'Brasil',
      state: 'SP',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const phoneCountryValue = useWatch({ control, name: 'phoneCountry' });
  const phoneNumberValue = useWatch({ control, name: 'phoneNumber' });
  const logoUrlValue = useWatch({ control, name: 'logoUrl' });
  const tradeNameValue = useWatch({ control, name: 'tradeName' });
  const cnpjValue = useWatch({ control, name: 'cnpj' });
  const cityValue = useWatch({ control, name: 'city' });
  const stateValue = useWatch({ control, name: 'state' });

  const summaryItems = useMemo(
    () => [
      {
        label: 'Empresa',
        value: tradeNameValue?.trim() || 'Sem nome fantasia',
        helper: 'Nome comercial para exibição',
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        label: 'Documento',
        value: cnpjValue?.trim() || 'CNPJ não informado',
        helper: 'Documento de Identificação Fiscal',
        icon: <Landmark className="h-4 w-4" />,
      },
      {
        label: 'Localização',
        value:
          cityValue?.trim() && stateValue?.trim()
            ? `${cityValue.trim()} - ${stateValue.trim()}`
            : 'Localização não definida',
        helper: 'Base principal da empresa cadastrada',
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: 'Status',
        value: hasCompany ? 'Configurada' : 'Pendente',
        helper: hasCompany ? 'Empresa cadastrada no sistema.' : 'Cadastre sua empresa',
        icon: <BadgeCheck className="h-4 w-4" />,
      },
    ],
    [cityValue, cnpjValue, hasCompany, stateValue, tradeNameValue],
  );

  const reloadCompany = useCallback(
    async (options?: { silentNotFound?: boolean }) => {
      try {
        const company = await CompanyService.readMine();

        setHasCompany(true);
        reset(mapCompanyToFormValues(company));
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
          setHasCompany(false);

          if (options?.silentNotFound) {
            return;
          }
        }

        if (!(error instanceof ApiError && error.statusCode === 404 && options?.silentNotFound)) {
          showError('Não foi possível carregar os dados da empresa.');
        }
      }
    },
    [reset, showError],
  );

  useEffect(() => {
    async function loadCompany() {
      try {
        await reloadCompany({ silentNotFound: true });
      } finally {
        setIsLoadingCompany(false);
      }
    }

    void loadCompany();
  }, [reloadCompany]);

  async function onSubmit(data: RecruiterCompanyFormValues) {
    const payload = {
      tradeName: data.tradeName,
      legalName: data.legalName,
      contacts: {
        email: data.email,
        website: data.website,
        phone: {
          country: data.phoneCountry,
          number: data.phoneNumber,
          isWhatsapp: true,
          isTelegram: false,
        },
        address: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
        },
      },
      documents: {
        cnpj: data.cnpj,
        isVerified: false,
      },
      media: {
        logoUrl: data.logoUrl,
      },
    };

    try {
      await (hasCompany ? CompanyService.updateMine(payload) : CompanyService.createMine(payload));
      await reloadCompany();

      if (hasCompany) {
        showSuccess('Empresa atualizada com sucesso.');
      } else {
        showSuccess('Empresa cadastrada com sucesso e enviada para aprovação.');
      }
    } catch {
      showError(
        hasCompany
          ? 'Não foi possível atualizar a empresa.'
          : 'Não foi possível cadastrar a empresa.',
      );
    }
  }

  function onInvalidSubmit(formErrors: FieldErrors<RecruiterCompanyFormValues>) {
    if (Object.keys(formErrors).length > 0) {
      showError('Preencha os campos obrigatórios para salvar a empresa.');
    }
  }

  const zipCodeField = register('zipCode', {
    required: 'Informe o CEP.',
    validate: (value) => value.replace(/\D/g, '').length === 8 || 'Informe um CEP válido.',
  });

  const cnpjField = register('cnpj', {
    required: 'Informe o CNPJ.',
    validate: (value) => value.replace(/\D/g, '').length === 14 || 'Informe um CNPJ válido.',
  });

  async function handleCnpjLookup(cnpj?: string) {
    const result = await searchCompanyByCnpj(cnpj || '');

    if (!result) {
      return;
    }

    setValue('legalName', result.legalName, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('tradeName', result.tradeName, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  async function handleZipCodeLookup(zipCode?: string) {
    const result = await searchZipCode(zipCode || '');

    if (!result) {
      return;
    }

    setValue('street', result.street, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('neighborhood', result.neighborhood, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('city', result.city, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('state', result.state, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  if (isLoadingCompany) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper={item.helper}
            icon={item.icon}
          />
        ))}
      </section>

      {!hasCompany && !tradeNameValue && !cnpjValue && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
          <EmptyState message="Nenhuma empresa cadastrada ainda. Preencha os dados abaixo para iniciar sua operação." />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur"
      >
        <div className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-zinc-100">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                <Building2 className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">Dados da empresa</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Centralize informações institucionais, contato e endereço da operação.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard
            title="Empresa"
            description="Defina identidade visual, razão social e documento fiscal da operação."
            icon={<Building2 className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FileUpload
                    label="Logo da empresa"
                    accept="image/*"
                    value={logoUrlValue}
                    onUpload={async (file) => {
                      const response = await UploadService.uploadCompanyLogo(file);

                      setValue('logoUrl', response.url, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });

                      return response.url;
                    }}
                  />
                </div>
              </div>

              <input type="hidden" {...register('logoUrl')} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      label="CNPJ"
                      labelClassName={labelClassName}
                      className={fieldClassName}
                      placeholder="00.000.000/0000-00"
                      error={errors.cnpj?.message}
                      {...cnpjField}
                      onChange={(event) => {
                        clearCnpjError();
                        const formattedValue = formatCnpj(event.target.value);

                        setValue('cnpj', formattedValue, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }}
                      onBlur={(event) => {
                        cnpjField.onBlur(event);
                        void handleCnpjLookup(event.target.value);
                      }}
                    />
                  </div>
                  <div className="hidden md:block" />
                </div>
              </div>

              {isCnpjLoading && (
                <div className="rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                  Consultando CNPJ...
                </div>
              )}

              {cnpjError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {cnpjError}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome fantasia"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.tradeName?.message}
                  {...register('tradeName', {
                    required: 'Informe o nome fantasia.',
                    validate: (value) => value.trim().length > 0 || 'Informe o nome fantasia.',
                  })}
                />

                <Input
                  label="Razão social"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.legalName?.message}
                  {...register('legalName', {
                    required: 'Informe a razão social.',
                    validate: (value) => value.trim().length > 0 || 'Informe a razão social.',
                  })}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Contato"
            description="Organize os canais que candidatos e parceiros vão utilizar para falar com sua empresa."
            icon={<Globe className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <input type="hidden" {...register('phoneCountry')} />
                  <input
                    type="hidden"
                    {...register('phoneNumber', {
                      required: 'Informe o telefone.',
                      validate: (value) =>
                        value.replace(/\D/g, '').length >= 8 || 'Informe o telefone.',
                    })}
                  />
                  <PhoneInput
                    labelClassName={labelClassName}
                    countryValue={phoneCountryValue || '+55'}
                    numberValue={phoneNumberValue || ''}
                    onCountryChange={(value) =>
                      setValue('phoneCountry', value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    onNumberChange={(value) =>
                      setValue('phoneNumber', value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    error={errors.phoneNumber?.message}
                  />
                </div>
                <div className="hidden md:block" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="E-mail"
                  labelClassName={labelClassName}
                  type="email"
                  className={fieldClassName}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Informe o e-mail.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Informe um e-mail válido.',
                    },
                  })}
                />

                <Input
                  label="Website"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="https://suaempresa.com.br"
                  {...register('website')}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Endereço"
            description="Defina a base da empresa para exibição operacional e preenchimento das vagas."
            icon={<MapPin className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      label="CEP"
                      labelClassName={labelClassName}
                      className={fieldClassName}
                      placeholder="01310-100"
                      error={errors.zipCode?.message}
                      {...zipCodeField}
                      onChange={(event) => {
                        clearZipCodeError();
                        const formattedValue = formatZipCode(event.target.value);

                        setValue('zipCode', formattedValue, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }}
                      onBlur={(event) => {
                        zipCodeField.onBlur(event);
                        void handleZipCodeLookup(event.target.value);
                      }}
                    />
                  </div>
                  <div className="hidden md:block" />
                </div>
              </div>

              {isZipCodeLoading && (
                <div className="rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                  Consultando CEP...
                </div>
              )}

              {zipCodeError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {zipCodeError}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Rua"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.street?.message}
                  {...register('street', {
                    required: 'Informe a rua.',
                    validate: (value) => value.trim().length > 0 || 'Informe a rua.',
                  })}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Número"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.number?.message}
                    {...register('number', {
                      required: 'Informe o número.',
                      validate: (value) => value.trim().length > 0 || 'Informe o número.',
                    })}
                  />

                  <Input
                    label="Complemento"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    {...register('complement')}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Bairro"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.neighborhood?.message}
                  {...register('neighborhood', {
                    required: 'Informe o bairro.',
                    validate: (value) => value.trim().length > 0 || 'Informe o bairro.',
                  })}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Cidade"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.city?.message}
                    {...register('city', {
                      required: 'Informe a cidade.',
                      validate: (value) => value.trim().length > 0 || 'Informe a cidade.',
                    })}
                  />

                  <Input
                    label="Estado"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.state?.message}
                    {...register('state', {
                      required: 'Informe o estado.',
                      validate: (value) => value.trim().length > 0 || 'Informe o estado.',
                    })}
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-6 flex justify-end border-t border-zinc-800 pt-6">
          <Button
            type="submit"
            variant="positive"
            icon={<Save className="h-4 w-4" />}
            disabled={isSubmitting}
            className="rounded-xl border-lime-500/20 bg-lime-500/10 px-5 py-2.5 text-lime-300 hover:bg-lime-500/15"
          >
            {isSubmitting ? 'Salvando...' : hasCompany ? 'Atualizar empresa' : 'Salvar empresa'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function mapCompanyToFormValues(company: CompanyEntity): RecruiterCompanyFormValues {
  return {
    tradeName: company.tradeName || '',
    legalName: company.legalName || '',
    email: company.contacts?.email || '',
    website: company.contacts?.website || '',
    phoneCountry: company.contacts?.phone?.country || '+55',
    phoneNumber: company.contacts?.phone?.number || '',
    street: company.contacts?.address?.street || '',
    number: company.contacts?.address?.number || '',
    complement: company.contacts?.address?.complement || '',
    neighborhood: company.contacts?.address?.neighborhood || '',
    city: company.contacts?.address?.city || '',
    state: company.contacts?.address?.state || 'SP',
    country: company.contacts?.address?.country || 'Brasil',
    zipCode: formatZipCode(company.contacts?.address?.zipCode || ''),
    cnpj: formatCnpj(company.documents?.cnpj || ''),
    logoUrl: company.media?.logoUrl || '',
  };
}
