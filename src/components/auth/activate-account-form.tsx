'use client';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {...register('email', {
          required: 'Informe seu e-mail.',
        })}
      />

      <Input
        icon={<FaKey />}
        placeholder="Código de ativação"
        error={errors.code?.message}
        {...register('code', {
          required: 'Informe o código de ativação.',
          minLength: {
            value: 6,
            message: 'O código deve ter 6 dígitos.',
          },
        })}
      />

      <Button
        type="submit"
        variant="positive"
        icon={<FaCheckCircle />}
        disabled={isSubmitting}
        className="w-full"
      >
        Ativar conta
      </Button>
    </form>
  );
}
