'use client';

import { useForm } from 'react-hook-form';
import { FaBirthdayCake, FaEnvelope, FaPhone, FaSave, FaUser } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { CARD_STYLES, TEXT_STYLES } from '@/constants/styles';

export function RecruiterProfileForm() {
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
      recruiterProfile: user?.recruiterProfile,
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
      <div className={CARD_STYLES.featureBox}>
        <h2 className={TEXT_STYLES.featureTitle}>
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

      <div className={CARD_STYLES.featureBox}>
        <h2 className={TEXT_STYLES.featureTitle}>
          Dados do recrutador
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Cargo"
            {...register('recruiterProfile.position')}
          />

          <Input
            icon={<FaPhone />}
            placeholder="Telefone"
            {...register('recruiterProfile.contacts.phone.number')}
          />

          <Input
            placeholder="País"
            {...register('recruiterProfile.contacts.phone.country')}
          />

          <Input
            placeholder="ID da empresa"
            {...register('recruiterProfile.companyId')}
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
