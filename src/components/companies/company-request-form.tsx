'use client';

import { useForm } from 'react-hook-form';
import { FaBuilding, FaEnvelope, FaGlobe, FaPhone, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompanyService } from '@/services/company/company.service';
import { CreateCompanyRequest } from '@/services/company/company.types';
import { useFlashMessage } from '@/contexts/flash-message-context';

export function CompanyRequestForm() {
  const { showSuccess, showError } = useFlashMessage();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateCompanyRequest>();

  async function onSubmit(data: CreateCompanyRequest) {
    try {
      await CompanyService.create(data);
      showSuccess('Empresa enviada para análise com sucesso.');
    } catch {
      showError('Não foi possível enviar a empresa para análise.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Dados da empresa
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            icon={<FaBuilding />}
            placeholder="Nome fantasia"
            {...register('tradeName', { required: true })}
          />

          <Input
            icon={<FaBuilding />}
            placeholder="Razão social"
            {...register('legalName')}
          />

          <Input
            placeholder="CNPJ"
            {...register('documents.cnpj')}
          />

          <Input
            placeholder="Logo URL"
            {...register('media.logoUrl')}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Contatos
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            icon={<FaEnvelope />}
            placeholder="E-mail"
            {...register('contacts.email', { required: true })}
          />

          <Input
            icon={<FaGlobe />}
            placeholder="Website"
            {...register('contacts.website')}
          />

          <Input
            icon={<FaPhone />}
            placeholder="Telefone"
            {...register('contacts.phone.number')}
          />

          <Input
            placeholder="País"
            {...register('contacts.phone.country')}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Endereço
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input placeholder="Rua" {...register('contacts.address.street')} />
          <Input placeholder="Número" {...register('contacts.address.number')} />
          <Input placeholder="Bairro" {...register('contacts.address.neighborhood')} />
          <Input placeholder="Cidade" {...register('contacts.address.city')} />
          <Input placeholder="Estado" {...register('contacts.address.state')} />
          <Input placeholder="CEP" {...register('contacts.address.zipCode')} />
        </div>
      </div>

      <Button
        type="submit"
        variant="positive"
        icon={<FaSave />}
        disabled={isSubmitting}
      >
        Enviar empresa
      </Button>
    </form>
  );
}
