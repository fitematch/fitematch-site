'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaSave, FaUserTie } from 'react-icons/fa';
import { GrDocumentText } from 'react-icons/gr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { ProfileSectionTitle } from './profile-section-title';

function formatBirthday(value?: string | Date) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('pt-BR');
}

export function RecruiterProfileForm() {
  const { user, refreshMe, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const boxClassName = 'rounded-2xl border border-gray-500 bg-black p-6';
  const fieldClassName =
    'rounded-xl border border-gray-500 bg-black text-gray-300 placeholder:text-gray-500 disabled:border-gray-500 disabled:bg-black disabled:text-gray-300 disabled:opacity-100';
  const labelClassName = 'text-gray-300';

  const {
    register,
    reset,
    getValues,
    formState: { isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name || '',
      recruiterProfile: {
        tradeName: user?.recruiterProfile?.tradeName || '',
        position: user?.recruiterProfile?.position || '',
        contacts: {
          phone: {
            country: user?.recruiterProfile?.contacts?.phone?.country || '',
            number: user?.recruiterProfile?.contacts?.phone?.number || '',
          },
        },
      },
    },
  });

  useEffect(() => {
    if (!user?.recruiterProfile?.companyId || user?.recruiterProfile?.tradeName) {
      return;
    }

    queueMicrotask(() => {
      void refreshMe();
    });
  }, [refreshMe, user?.recruiterProfile?.companyId, user?.recruiterProfile?.tradeName]);

  useEffect(() => {
    reset({
      name: user?.name || '',
      recruiterProfile: {
        tradeName: user?.recruiterProfile?.tradeName || '',
        position: user?.recruiterProfile?.position || '',
        contacts: {
          phone: {
            country: user?.recruiterProfile?.contacts?.phone?.country || '',
            number: user?.recruiterProfile?.contacts?.phone?.number || '',
          },
        },
      },
    });
  }, [reset, user]);

  async function handleSaveBasic() {
    try {
      await updateMe({
        name: getValues('name'),
      });
      showSuccess('Dados básicos atualizados com sucesso.');
    } catch {
      showError('Não foi possível atualizar os dados básicos.');
    }
  }

  async function handleSaveRecruiter() {
    const values = getValues();

    try {
      await updateMe({
        recruiterProfile: {
          ...user?.recruiterProfile,
          tradeName: values.recruiterProfile?.tradeName,
          position: values.recruiterProfile?.position,
          contacts: {
            ...user?.recruiterProfile?.contacts,
            phone: {
              ...user?.recruiterProfile?.contacts?.phone,
              country: values.recruiterProfile?.contacts?.phone?.country,
              number: values.recruiterProfile?.contacts?.phone?.number,
            },
          },
        },
      });
      showSuccess('Dados do recrutador atualizados com sucesso.');
    } catch {
      showError('Não foi possível atualizar os dados do recrutador.');
    }
  }

  return (
    <div className="space-y-8">
      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Dados básicos"
          icon={GrDocumentText}
          titleClassName="text-gray-300"
          iconClassName="text-gray-300"
          toggleIconClassName="text-gray-300"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Nome"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="Nome"
            {...register('name')}
          />
          <div className="hidden md:block" />

          <Input
            label="E-mail"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="E-mail"
            value={user?.email || ''}
            disabled
          />

          <Input
            label="Data de nascimento"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="Data de nascimento"
            value={formatBirthday(user?.birthday)}
            disabled
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="positive"
            icon={<FaSave />}
            disabled={isSubmitting}
            onClick={handleSaveBasic}
          >
            Salvar
          </Button>
        </div>
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Dados do recrutador"
          icon={FaUserTie}
          titleClassName="text-gray-300"
          iconClassName="text-gray-300"
          toggleIconClassName="text-gray-300"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Empresa"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="Empresa"
            {...register('recruiterProfile.tradeName')}
          />

          <Input
            label="Cargo"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="Cargo"
            {...register('recruiterProfile.position')}
          />

          <Input
            label="País"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="País"
            {...register('recruiterProfile.contacts.phone.country')}
          />

          <Input
            label="Telefone"
            labelClassName={labelClassName}
            className={fieldClassName}
            placeholder="Telefone"
            {...register('recruiterProfile.contacts.phone.number')}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="positive"
            icon={<FaSave />}
            disabled={isSubmitting}
            onClick={handleSaveRecruiter}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
