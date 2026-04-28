'use client';

import { useForm } from 'react-hook-form';
import {
  FaBirthdayCake,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaSave,
  FaUser,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';

export function CandidateProfileForm() {
  const { user, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name,
      birthday: user?.birthday,
      candidateProfile: user?.candidateProfile,
    },
  });

  async function onSubmit(data: UpdateMeRequest) {
    try {
      await updateMe(data);
      showSuccess('Perfil atualizado com sucesso.');
    } catch {
      showError('Não foi possível atualizar seu perfil.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Dados básicos
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input icon={<FaUser />} placeholder="Nome" {...register('name')} />

          <Input
            icon={<FaBirthdayCake />}
            type="date"
            placeholder="Data de nascimento"
            {...register('birthday')}
          />

          <Input
            icon={<FaEnvelope />}
            placeholder="E-mail"
            value={user?.email}
            disabled
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Contatos
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            icon={<FaPhone />}
            placeholder="Telefone"
            {...register('candidateProfile.contacts.phone.number')}
          />

          <Input
            placeholder="País"
            {...register('candidateProfile.contacts.phone.country')}
          />

          <Input
            placeholder="Cidade"
            {...register('candidateProfile.contacts.address.city')}
          />

          <Input
            placeholder="Estado"
            {...register('candidateProfile.contacts.address.state')}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Documentos
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            icon={<FaIdCard />}
            placeholder="CPF"
            {...register('candidateProfile.documents.cpf.number')}
          />

          <Input
            icon={<FaIdCard />}
            placeholder="RG"
            {...register('candidateProfile.documents.rg.number')}
          />

          <Input
            placeholder="Órgão emissor"
            {...register('candidateProfile.documents.rg.issuer')}
          />

          <Input
            placeholder="Estado do RG"
            {...register('candidateProfile.documents.rg.state')}
          />

          <Input
            placeholder="CREF"
            {...register('candidateProfile.documents.cref.number')}
          />

          <Input
            placeholder="Categoria CREF"
            {...register('candidateProfile.documents.cref.category')}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-900 p-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Mídia
        </h2>

        <div className="mt-6">
          <Input
            placeholder="URL do currículo"
            {...register('candidateProfile.media.resumeUrl')}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="positive"
        icon={<FaSave />}
        disabled={isSubmitting}
      >
        Salvar perfil
      </Button>
    </form>
  );
}