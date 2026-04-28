'use client';

import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { flashMessage, showSuccess, showError } = useFlashMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestActivationCodeRequest>();

  async function onSubmit(data: RequestActivationCodeRequest) {
    try {
      await AuthService.requestActivationCode(data);
      showSuccess('Código de ativação enviado com sucesso.');
      router.push(ROUTES.ACTIVATE_ACCOUNT);
    } catch {
      showError('Não foi possível enviar o código de ativação.');
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

      <Button
        type="submit"
        variant="positive"
        icon={<FaPaperPlane />}
        disabled={isSubmitting}
        className="w-full"
      >
        Solicitar código de ativação.
      </Button>
    </form>
  );
}
