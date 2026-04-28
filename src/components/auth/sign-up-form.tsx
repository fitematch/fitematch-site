'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaBirthdayCake, FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/auth/auth.service';
import { SignUpRequest } from '@/services/auth/auth.types';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { TermsOfUseModal } from './terms-of-use-modal';
import { PrivacyPolicyModal } from './privacy-policy-modal';
import { THEME } from '@/constants/theme';

export function SignUpForm() {
  const { showSuccess, showError } = useFlashMessage();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpRequest>({
    defaultValues: {
      productRole: ProductRoleEnum.CANDIDATE,
      acceptedTermsOfUse: false,
      acceptedPrivacyPolicy: false,
    },
  });

  async function onSubmit(data: SignUpRequest) {
    try {
      await AuthService.signUp(data);
      showSuccess('Conta criada com sucesso.');
    } catch {
      showError('Não foi possível criar sua conta.');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md space-y-4">
        <Input
          icon={<FaUser />}
          placeholder="Nome"
          error={errors.name?.message}
          {...register('name', { required: 'Informe seu nome.' })}
        />

        <Input
          icon={<FaEnvelope />}
          type="email"
          placeholder="E-mail"
          error={errors.email?.message}
          {...register('email', { required: 'Informe seu e-mail.' })}
        />

        <Input
          icon={<FaLock />}
          type="password"
          placeholder="Senha"
          error={errors.password?.message}
          {...register('password', { required: 'Informe sua senha.' })}
        />

        <Input
          icon={<FaBirthdayCake />}
          type="date"
          error={errors.birthday?.message}
          {...register('birthday', { required: 'Informe sua data de nascimento.' })}
        />

        <select
          className={`w-full rounded-md border ${THEME.form.input}`}
          {...register('productRole', { required: true })}
        >
          <option value={ProductRoleEnum.CANDIDATE}>Candidato</option>
          <option value={ProductRoleEnum.RECRUITER}>Recrutador</option>
        </select>

        <label className={`flex gap-3 text-sm ${THEME.text.body}`}>
          <input
            type="checkbox"
            {...register('acceptedTermsOfUse', { required: true })}
          />
          <span>
            Aceito os{' '}
            <button type="button" onClick={() => setIsTermsOpen(true)} className="text-gray-500 underline">
              Termos de Uso
            </button>
          </span>
        </label>

        <label className={`flex gap-3 text-sm ${THEME.text.body}`}>
          <input
            type="checkbox"
            {...register('acceptedPrivacyPolicy', { required: true })}
          />
          <span>
            Aceito a{' '}
            <button type="button" onClick={() => setIsPrivacyOpen(true)} className="text-gray-500 underline">
              Política de Privacidade
            </button>
          </span>
        </label>

        <Button
          type="submit"
          variant="positive"
          icon={<FaUserPlus />}
          disabled={isSubmitting}
          className="w-full"
        >
          Criar conta
        </Button>
      </form>

      <TermsOfUseModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}
