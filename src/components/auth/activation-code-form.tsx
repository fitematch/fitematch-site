'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineFlashMessage } from '@/components/ui/inline-flash-message';
import { ROUTES } from '@/constants/routes';
import { AuthService } from '@/services/auth/auth.service';
import { RequestActivationCodeRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';

export function ActivationCodeForm() {
  const { flashMessage, showSuccess, showError } = useFlashMessage();
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestActivationCodeRequest>();

  async function onSubmit(data: RequestActivationCodeRequest) {
    try {
      await AuthService.requestActivationCode(data);
      setCooldown(60);
      showSuccess('Código de ativação enviado com sucesso.');
    } catch {
      showError('Não foi possível enviar o código de ativação.');
    }
  }

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldown]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur"
    >
      <div className="mb-8">
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-50 uppercase">
          Código de ativação
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Solicite um novo código de ativação para sua conta.
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
      </div>

      <Button
        type="submit"
        variant="positive"
        icon={<FaPaperPlane />}
        disabled={isSubmitting || cooldown > 0}
        className="mt-6 w-full rounded-2xl border border-zinc-800 bg-lime-500 py-3 text-white transition-all duration-300 hover:bg-lime-400"
      >
        Solicitar código
      </Button>

      {cooldown > 0 && (
        <p className="mt-3 text-center text-sm text-zinc-500">
          Solicitar novo código em {cooldown} segundos.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-zinc-500">
        Já recebeu o código?{' '}
        <Link
          href={ROUTES.ACTIVATE_ACCOUNT}
          className="text-lime-400 transition-colors hover:text-lime-300"
        >
          Ativar conta
        </Link>
      </p>
    </form>
  );
}
