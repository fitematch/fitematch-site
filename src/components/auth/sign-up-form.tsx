'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  FaBirthdayCake,
  FaEnvelope,
  FaLock,
  FaRegCircle,
  FaRegDotCircle,
  FaUser,
  FaUserPlus,
  FaUserTie,
} from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineFlashMessage } from '@/components/ui/inline-flash-message';
import { AuthService } from '@/services/auth/auth.service';
import { SignUpRequest } from '@/services/auth/auth.types';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { TermsOfUseModal } from './terms-of-use-modal';
import { PrivacyPolicyModal } from './privacy-policy-modal';
import { THEME } from '@/constants/theme';

interface SignUpFormValues extends SignUpRequest {
  acceptedTermsOfUse: boolean;
  acceptedPrivacyPolicy: boolean;
}

export function SignUpForm() {
  const { flashMessage, showSuccess, showError } = useFlashMessage();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      productRole: ProductRoleEnum.CANDIDATE,
      acceptedTermsOfUse: false,
      acceptedPrivacyPolicy: false,
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    const payload: SignUpRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
      birthday: data.birthday,
      productRole: data.productRole,
    };

    try {
      await AuthService.signUp(payload);
      showSuccess('Conta criada com sucesso.');
    } catch {
      showError('Não foi possível criar sua conta.');
    }
  }

  const selectedRole = useWatch({
    control,
    name: 'productRole',
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md space-y-4">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: ProductRoleEnum.CANDIDATE,
                label: 'Candidato',
                description: 'Busque vagas',
                icon: FaUserTie,
              },
              {
                value: ProductRoleEnum.RECRUITER,
                label: 'Recrutador',
                description: 'Ache candidatos',
                icon: FaBuildingUser,
              },
            ].map(({ value, label, description, icon: RoleIcon }) => {
              const isSelected = selectedRole === value;
              const SelectionIcon = isSelected ? FaRegDotCircle : FaRegCircle;

              return (
                <label
                  key={value}
                  className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    isSelected
                      ? 'border-gray-100 bg-gray-900/40'
                      : 'border-gray-800 bg-black hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    className="sr-only"
                    {...register('productRole', { required: true })}
                  />

                  <div
                    className={`mt-0.5 text-lg transition ${
                      isSelected ? 'text-gray-100' : 'text-gray-600 group-hover:text-gray-400'
                    }`}
                  >
                    <SelectionIcon />
                  </div>

                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                        isSelected
                          ? 'border-gray-100 bg-gray-100 text-black'
                          : 'border-gray-800 bg-gray-950 text-gray-500 group-hover:border-gray-600 group-hover:text-gray-300'
                      }`}
                    >
                      <RoleIcon className="text-lg" />
                    </div>

                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${isSelected ? 'text-gray-100' : THEME.text.body}`}>
                        {label}
                      </p>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <Input
          icon={<FaUser />}
          placeholder="Nome"
          error={errors.name?.message}
          {...register('name', { required: 'Informe seu nome.' })}
        />

        {flashMessage && (
          <InlineFlashMessage
            type={flashMessage.type}
            message={flashMessage.message}
          />
        )}

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
          Criar cadastro
        </Button>
      </form>

      <TermsOfUseModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}
