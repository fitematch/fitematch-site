'use client';

import { useForm } from 'react-hook-form';
import { FaBuilding, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { CompanyService } from '@/services/company/company.service';
import { useAuth } from '@/hooks/use-auth';
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

interface CompanyResponseWithId {
  _id?: string;
  id?: string;
}

export function RecruiterCompanyForm() {
  const { user, updateMe, refreshMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const fieldClassName =
    'mt-2 w-full rounded-xl border border-gray-300 bg-black px-4 py-3 text-gray-300 outline-none placeholder:text-gray-300';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterCompanyFormValues>({
    defaultValues: {
      phoneCountry: '55',
      country: 'Brasil',
      state: 'SP',
    },
  });

  async function onSubmit(data: RecruiterCompanyFormValues) {
    try {
      const company = await CompanyService.create({
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
      });

      const createdCompany = company as CompanyResponseWithId;
      const companyId = createdCompany._id || createdCompany.id;

      if (companyId) {
        await updateMe({
          recruiterProfile: {
            ...user?.recruiterProfile,
            companyId,
            position: user?.recruiterProfile?.position || 'Recruiter',
            contacts: user?.recruiterProfile?.contacts,
          },
        });

        await refreshMe();
      }

      showSuccess('Empresa cadastrada com sucesso.');
    } catch {
      showError('Não foi possível cadastrar a empresa.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-gray-500 bg-black p-6"
    >
      <div className="mb-6 flex items-center gap-3 text-gray-100">
        <FaBuilding />
        <h2 className="text-xl font-semibold uppercase">Dados da empresa</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-gray-300">Nome fantasia</label>
          <input
            className={fieldClassName}
            {...register('tradeName', {
              required: 'Informe o nome fantasia.',
            })}
          />
          {errors.tradeName && (
            <p className="mt-1 text-sm text-red-100">
              {errors.tradeName.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-300">Razão social</label>
          <input
            className={fieldClassName}
            {...register('legalName', {
              required: 'Informe a razão social.',
            })}
          />
          {errors.legalName && (
            <p className="mt-1 text-sm text-red-100">
              {errors.legalName.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-300">E-mail</label>
          <input
            type="email"
            className={fieldClassName}
            {...register('email', {
              required: 'Informe o e-mail.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Website</label>
          <input
            className={fieldClassName}
            {...register('website')}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Telefone</label>
          <input
            className={fieldClassName}
            {...register('phoneNumber', {
              required: 'Informe o telefone.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">CNPJ</label>
          <input
            className={fieldClassName}
            {...register('cnpj', {
              required: 'Informe o CNPJ.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Rua</label>
          <input
            className={fieldClassName}
            {...register('street', {
              required: 'Informe a rua.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Número</label>
          <input
            className={fieldClassName}
            {...register('number', {
              required: 'Informe o número.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Complemento</label>
          <input
            className={fieldClassName}
            {...register('complement')}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Bairro</label>
          <input
            className={fieldClassName}
            {...register('neighborhood', {
              required: 'Informe o bairro.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Cidade</label>
          <input
            className={fieldClassName}
            {...register('city', {
              required: 'Informe a cidade.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Estado</label>
          <input
            className={fieldClassName}
            {...register('state', {
              required: 'Informe o estado.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">CEP</label>
          <input
            className={fieldClassName}
            {...register('zipCode', {
              required: 'Informe o CEP.',
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Logo URL</label>
          <input
            className={fieldClassName}
            {...register('logoUrl')}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="positive"
          icon={<FaSave />}
          disabled={isSubmitting}
        >
          Salvar empresa
        </Button>
      </div>
    </form>
  );
}
