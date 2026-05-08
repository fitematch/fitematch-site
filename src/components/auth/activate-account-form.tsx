'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaCheckCircle, FaEnvelope, FaKey } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineFlashMessage } from '@/components/ui/inline-flash-message';
import { ROUTES } from '@/constants/routes';
import { AuthService } from '@/services/auth/auth.service';
import { ActivateAccountRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';

export function ActivateAccountForm() {
  const router = useRouter();
  const { flashMessage, showSuccess, showError } = useFlashMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateAccountRequest>();

  async function onSubmit(data: ActivateAccountRequest) {
    try {
      await AuthService.activateAccount(data);
      showSuccess('Conta ativada com sucesso.');
      router.push(ROUTES.SIGN_IN);
    } catch {
      showError('Não foi possível ativar sua conta.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur"
    >
      <div className="mb-8">
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-50 uppercase">
          Ativar conta
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Informe o e-mail e o código recebido para ativar.
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
          {...register('email', {
            required: 'Informe seu e-mail.',
          })}
        />

        <Input
          icon={<FaKey />}
          placeholder="Código de ativação"
          error={errors.code?.message}
          className="border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-500"
          {...register('code', {
            required: 'Informe o código de ativação.',
            minLength: {
              value: 6,
              message: 'O código deve ter 6 dígitos.',
            },
          })}
        />
      </div>

      <Button
        type="submit"
        variant="positive"
        icon={<FaCheckCircle />}
        disabled={isSubmitting}
        className="mt-6 w-full rounded-2xl border border-zinc-800 bg-lime-500 py-3 text-white transition-all duration-300 hover:bg-lime-400"
      >
        Ativar conta
      </Button>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Precisa de um novo código?{' '}
        <Link
          href={ROUTES.ACTIVATION_CODE}
          className="text-lime-400 transition-colors hover:text-lime-300"
        >
          Solicitar novamente
        </Link>
      </p>
    </form>
  );
}
