'use client';

import { useCallback, useEffect, useState } from 'react';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { FaBuilding, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/form/phone-input';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { useAddressByZipCode } from '@/hooks/use-address-by-zipcode';
import { useCompanyByCnpj } from '@/hooks/use-company-by-cnpj';
import { CompanyService } from '@/services/company/company.service';
import { ApiError } from '@/services/http/api-error';
import { UploadService } from '@/services/upload/upload.service';
import { CompanyEntity } from '@/types/entities/company.entity';
import { useFlashMessage } from '@/contexts/flash-message-context';

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
  const labelClassName = 'text-gray-300';
  const fieldClassName =
    'rounded-xl border border-gray-500 bg-black text-gray-300 placeholder:text-gray-500';

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
  const phoneCountryValue = useWatch({
    control,
    name: 'phoneCountry',
  });
  const phoneNumberValue = useWatch({
    control,
    name: 'phoneNumber',
  });
  const logoUrlValue = useWatch({
    control,
    name: 'logoUrl',
  });

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
    [reset, showError]
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
      await (hasCompany
        ? await CompanyService.updateMine(payload)
        : await CompanyService.createMine(payload));
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
          : 'Não foi possível cadastrar a empresa.'
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
    validate: (value) =>
      value.replace(/\D/g, '').length === 8 || 'Informe um CEP válido.',
  });
  const cnpjField = register('cnpj', {
    required: 'Informe o CNPJ.',
    validate: (value) =>
      value.replace(/\D/g, '').length === 14 || 'Informe um CNPJ válido.',
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
    return (
      <div className="rounded-2xl border border-gray-500 bg-black p-6 text-gray-300">
        Carregando dados da empresa...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className="rounded-2xl border border-gray-500 bg-black p-6"
    >
      <div className="mb-6 flex items-center gap-3 text-gray-100">
        <FaBuilding />
        <h2 className="text-xl font-semibold uppercase">Dados da empresa</h2>
      </div>

      <div className="space-y-4">
        <fieldset className="rounded-2xl border border-gray-500 p-5">
          <legend className="px-2 text-sm font-semibold uppercase text-gray-100">
            Empresa
          </legend>

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
              <div className="hidden md:block" />
            </div>
            <input
              type="hidden"
              {...register('logoUrl')}
            />

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
              <div />
            </div>

            {isCnpjLoading && (
              <p className="text-sm text-gray-300">Consultando CNPJ...</p>
            )}

            {cnpjError && (
              <p className="text-sm text-red-100">{cnpjError}</p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input
                  label="Nome fantasia"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.tradeName?.message}
                  {...register('tradeName', {
                    required: 'Informe o nome fantasia.',
                    validate: (value) =>
                      value.trim().length > 0 || 'Informe o nome fantasia.',
                  })}
                />
              </div>

              <div>
                <Input
                  label="Razão social"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.legalName?.message}
                  {...register('legalName', {
                    required: 'Informe a razão social.',
                    validate: (value) =>
                      value.trim().length > 0 || 'Informe a razão social.',
                  })}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-gray-500 p-5">
          <legend className="px-2 text-sm font-semibold uppercase text-gray-100">
            Contato
          </legend>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <input
                  type="hidden"
                  {...register('phoneCountry')}
                />
                <input
                  type="hidden"
                  {...register('phoneNumber', {
                    required: 'Informe o telefone.',
                    validate: (value) =>
                      value.replace(/\D/g, '').length >= 8 || 'Informe o telefone.',
                  })}
                />
                <PhoneInput
                  label="Telefone"
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
              <div />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
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
              </div>

              <div>
                <Input
                  label="Website"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  {...register('website')}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-gray-500 p-5">
          <legend className="px-2 text-sm font-semibold uppercase text-gray-100">
            Endereço
          </legend>

          <div className="grid gap-4">
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
              <div />
            </div>

            {isZipCodeLoading && (
              <p className="text-sm text-gray-300">Consultando CEP...</p>
            )}

            {zipCodeError && (
              <p className="text-sm text-red-100">{zipCodeError}</p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input
                  label="Rua"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.street?.message}
                  {...register('street', {
                    required: 'Informe a rua.',
                    validate: (value) =>
                      value.trim().length > 0 || 'Informe a rua.',
                  })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Input
                    label="Número"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.number?.message}
                    {...register('number', {
                      required: 'Informe o número.',
                      validate: (value) =>
                        value.trim().length > 0 || 'Informe o número.',
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Complemento"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    {...register('complement')}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input
                  label="Bairro"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  error={errors.neighborhood?.message}
                  {...register('neighborhood', {
                    required: 'Informe o bairro.',
                    validate: (value) =>
                      value.trim().length > 0 || 'Informe o bairro.',
                  })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Input
                    label="Cidade"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.city?.message}
                    {...register('city', {
                      required: 'Informe a cidade.',
                      validate: (value) =>
                        value.trim().length > 0 || 'Informe a cidade.',
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Estado"
                    labelClassName={labelClassName}
                    className={fieldClassName}
                    error={errors.state?.message}
                    {...register('state', {
                      required: 'Informe o estado.',
                      validate: (value) =>
                        value.trim().length > 0 || 'Informe o estado.',
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="positive"
          icon={<FaSave />}
          disabled={isSubmitting}
        >
          {hasCompany ? 'Atualizar empresa' : 'Salvar empresa'}
        </Button>
      </div>
    </form>
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
