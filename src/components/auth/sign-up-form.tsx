'use client';

import Link from 'next/link';
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
import { ROUTES } from '@/constants/routes';

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-2xl rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur"
      >
        <div className="mb-8">
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-50">
            CRIE SUA CONTA
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Escolha seu perfil e configure o acesso inicial à plataforma.
          </p>
        </div>

        <div className="space-y-4">
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
                    className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                      isSelected
                        ? 'border-lime-500/25 bg-lime-500/10'
                        : 'border-zinc-800 bg-black hover:border-zinc-700'
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
                        isSelected ? 'text-lime-300' : 'text-zinc-600 group-hover:text-zinc-300'
                      }`}
                    >
                      <SelectionIcon />
                    </div>

                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                          isSelected
                            ? 'border-lime-500/20 bg-lime-500/10 text-lime-400'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-300'
                        }`}
                      >
                        <RoleIcon className="text-lg" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold ${isSelected ? 'text-zinc-50' : 'text-zinc-300'}`}
                        >
                          {label}
                        </p>
                        <p
                          className={`text-xs leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}
                        >
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
            className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
            {...register('name', { required: 'Informe seu nome.' })}
          />

          {flashMessage && (
            <InlineFlashMessage type={flashMessage.type} message={flashMessage.message} />
          )}

          <Input
            icon={<FaEnvelope />}
            type="email"
            placeholder="E-mail"
            error={errors.email?.message}
            className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
            {...register('email', { required: 'Informe seu e-mail.' })}
          />

          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Senha"
            error={errors.password?.message}
            className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
            {...register('password', { required: 'Informe sua senha.' })}
          />

          <Input
            icon={<FaBirthdayCake />}
            type="date"
            error={errors.birthday?.message}
            className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
            {...register('birthday', { required: 'Informe sua data de nascimento.' })}
          />

          <label className="flex gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              {...register('acceptedTermsOfUse', { required: true })}
              className="mt-0.5 rounded border-zinc-700 bg-black text-lime-500"
            />
            <span>
              Aceito os{' '}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="text-lime-400 underline"
              >
                Termos de Uso
              </button>
            </span>
          </label>

          <label className="flex gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              {...register('acceptedPrivacyPolicy', { required: true })}
              className="mt-0.5 rounded border-zinc-700 bg-black text-lime-500"
            />
            <span>
              Aceito a{' '}
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-lime-400 underline"
              >
                Política de Privacidade
              </button>
            </span>
          </label>

          <Button
            type="submit"
            variant="positive"
            icon={<FaUserPlus />}
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-lime-500/30 bg-lime-500/10 py-3 text-lime-300 transition-all duration-300 hover:border-lime-400/40 hover:bg-lime-500/14 hover:text-lime-200"
          >
            Criar cadastro
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Já tem conta?{' '}
            <Link
              href={ROUTES.SIGN_IN}
              className="text-lime-400 transition-colors hover:text-lime-300"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </form>

      <TermsOfUseModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}
