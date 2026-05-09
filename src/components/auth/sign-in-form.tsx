'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineFlashMessage } from '@/components/ui/inline-flash-message';
import { SignInRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/routes';
import { UserStatusEnum } from '@/types/entities/user.entity';

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { flashMessage, showSuccess, showError } = useFlashMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInRequest>();

  async function onSubmit(data: SignInRequest) {
    try {
      const response = await signIn(data);

      if (response.user?.status === UserStatusEnum.PENDING) {
        showSuccess('Conta pendente. Ative sua conta para continuar.');
        router.push(`${ROUTES.ACTIVATE_ACCOUNT}?email=${encodeURIComponent(data.email)}`);
        return;
      }

      showSuccess('Login realizado com sucesso.');
      router.push(ROUTES.HOME);
    } catch {
      showError('Não foi possível realizar login.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur"
    >
      <div className="mb-8">
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-50 uppercase">
          Entre com a sua conta
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Informe seu e-mail e senha para continuar.
        </p>
      </div>

      <div className="space-y-4">
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
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          variant="login"
          icon={<FaSignInAlt />}
          disabled={isSubmitting}
          className="w-full rounded-2xl border border-lime-500/30 bg-lime-500/10 py-3 text-lime-300 transition-all duration-300 hover:border-lime-400/40 hover:bg-lime-500/14 hover:text-lime-200 sm:w-auto"
        >
          Entrar
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Ainda não tem conta?{' '}
        <Link href={ROUTES.SIGN_UP} className="text-lime-400 transition-colors hover:text-lime-300">
          Criar cadastro
        </Link>
      </p>
    </form>
  );
}
