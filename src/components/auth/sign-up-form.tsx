'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  acceptedLegalTerms: boolean;
}

export function SignUpForm() {
  const router = useRouter();
  const { flashMessage, showSuccess, showError } = useFlashMessage();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState('');

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      productRole: ProductRoleEnum.CANDIDATE,
      acceptedLegalTerms: false,
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
      router.push(`${ROUTES.ACTIVATE_ACCOUNT}?email=${encodeURIComponent(data.email)}`);
    } catch {
      showError('Não foi possível criar sua conta.');
    }
  }

  const selectedRole = useWatch({
    control,
    name: 'productRole',
  });
  const acceptedLegalTerms = useWatch({
    control,
    name: 'acceptedLegalTerms',
  });

  function formatBirthdayInput(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  function toIsoBirthday(value: string) {
    const [day, month, year] = value.split('/');

    if (!day || !month || !year || year.length !== 4) {
      return '';
    }

    const parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return `${year}-${month}-${day}`;
  }

  function handleBirthdayChange(value: string) {
    const formattedValue = formatBirthdayInput(value);
    setBirthdayInput(formattedValue);
    setValue('birthday', toIsoBirthday(formattedValue), { shouldValidate: true });
  }

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
            {...register('birthday', { required: 'Informe sua data de nascimento.' })}
            type="text"
            inputMode="numeric"
            placeholder="dd/mm/yyyy"
            maxLength={10}
            value={birthdayInput}
            onChange={(event) => handleBirthdayChange(event.target.value)}
            error={errors.birthday?.message}
            className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
          />

          <label className="flex gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              {...register('acceptedLegalTerms', { required: true })}
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
              </button>{' '}
              e a{' '}
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-lime-400 underline"
              >
                Política de Privacidade
              </button>
            </span>
          </label>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="positive"
              icon={<FaUserPlus />}
              disabled={isSubmitting || !acceptedLegalTerms}
              className="w-full rounded-2xl border border-lime-500/30 bg-lime-500/10 py-3 text-lime-300 transition-all duration-300 hover:border-lime-400/40 hover:bg-lime-500/14 hover:text-lime-200 sm:w-auto"
            >
              Criar cadastro
            </Button>
          </div>

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
