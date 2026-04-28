'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignInRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/routes';

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { showSuccess, showError } = useFlashMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInRequest>();

  async function onSubmit(data: SignInRequest) {
    try {
      await signIn(data);
      showSuccess('Login realizado com sucesso.');
      router.push(ROUTES.PROFILE);
    } catch {
      showError('Não foi possível realizar login.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md space-y-4">
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

      <Button
        type="submit"
        variant="login"
        icon={<FaSignInAlt />}
        disabled={isSubmitting}
        className="w-full"
      >
        Entrar
      </Button>
    </form>
  );
}