'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileSectionTitle } from './profile-section-title';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { RecruiterProfileForm } from './recruiter-profile-form';

function hasValue(value: unknown) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

export function ProfileForm() {
  const { user } = useAuth();

  if (user?.productRole === ProductRoleEnum.RECRUITER) {
    return <RecruiterProfileForm />;
  }

  return <CandidateProfileForm />;
}

function CandidateProfileForm() {
  const { user, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();

  const {
    register,
    getValues,
    formState: { isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name,
      birthday: user?.birthday,
      candidateProfile: user?.candidateProfile,
    },
  });

  async function submitCandidateUpdate(
    payload: UpdateMeRequest,
    successMessage: string,
    errorMessage: string,
  ) {
    try {
      await updateMe(payload);
      showSuccess(successMessage);
    } catch {
      showError(errorMessage);
    }
  }

  function handleSaveDocuments() {
    const documents = getValues('candidateProfile.documents');

    const rg = documents?.rg;
    const cpf = documents?.cpf;
    const cref = documents?.cref;
    const passport = documents?.passport;

    const nextDocuments = {
      ...(hasValue(rg?.number)
        ? {
            rg: {
              number: String(rg?.number),
              issuer: hasValue(rg?.issuer) ? String(rg?.issuer) : '',
              state: hasValue(rg?.state) ? String(rg?.state) : '',
            },
          }
        : {}),

      ...(hasValue(cpf?.number)
        ? {
            cpf: {
              number: String(cpf?.number),
            },
          }
        : {}),

      ...(hasValue(cref?.number) || hasValue(cref?.category) || cref?.isActive
        ? {
            cref: {
              number: hasValue(cref?.number) ? String(cref?.number) : '',
              category: hasValue(cref?.category)
                ? String(cref?.category)
                : '',
              isActive: Boolean(cref?.isActive),
            },
          }
        : {}),

      ...(hasValue(passport?.number) ||
      hasValue(passport?.country) ||
      hasValue(passport?.expirationDate)
        ? {
            passport: {
              number: hasValue(passport?.number)
                ? String(passport?.number)
                : '',
              country: hasValue(passport?.country)
                ? String(passport?.country)
                : '',
              expirationDate: passport?.expirationDate as Date,
            },
          }
        : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          documents: nextDocuments,
        },
      },
      'Documentos atualizados com sucesso.',
      'Não foi possível atualizar os documentos.',
    );
  }

  return (
    <form className="space-y-8">
      <div className="rounded-2xl border border-gray-500 bg-black p-6">
        <ProfileSectionTitle title="Documentos" />

        <div className="mt-6 space-y-4">
          <Input
            label="RG Número"
            {...register('candidateProfile.documents.rg.number')}
          />

          <Input
            label="Órgão Emissor"
            {...register('candidateProfile.documents.rg.issuer')}
          />

          <Input
            label="Estado"
            {...register('candidateProfile.documents.rg.state')}
          />

          <Input
            label="CPF"
            {...register('candidateProfile.documents.cpf.number')}
          />

          <Input
            label="CREF Número"
            {...register('candidateProfile.documents.cref.number')}
          />

          <Input
            label="Categoria"
            {...register('candidateProfile.documents.cref.category')}
          />

          <Input
            label="Passaporte Número"
            {...register('candidateProfile.documents.passport.number')}
          />

          <Input
            label="País"
            {...register('candidateProfile.documents.passport.country')}
          />

          <Input
            label="Validade"
            {...register('candidateProfile.documents.passport.expirationDate')}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSaveDocuments}
              disabled={isSubmitting}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
