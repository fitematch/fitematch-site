'use client';

import { useForm } from 'react-hook-form';
import {
  FaBirthdayCake,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaSave,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { CARD_STYLES } from '@/constants/styles';
import {
  ProductRoleEnum,
  EthnicityTypeEnum,
  GenderIdentityEnum,
  SexualOrientationEnum,
  ClothingSizeEnum,
  ShoesSizeUnitEnum,
  AvailabilityShiftEnum,
} from '@/types/entities/user.entity';
import { RecruiterProfileForm } from './recruiter-profile-form';
import { ProfileSectionTitle } from './profile-section-title';

export function ProfileForm() {
  const { user } = useAuth();

  if (user?.productRole === ProductRoleEnum.RECRUITER) {
    return <RecruiterProfileForm />;
  }

  return <CandidateProfileForm />;
}

import { useState } from 'react';

export function CandidateProfileForm() {
  const { user, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [showBasic, setShowBasic] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name,
      birthday: user?.birthday,
      candidateProfile: user?.candidateProfile,
    },
  });

  async function onSubmit(data: UpdateMeRequest) {
    try {
      await updateMe(data);
      showSuccess('Perfil atualizado com sucesso.');
    } catch {
      showError('Não foi possível atualizar seu perfil.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className={CARD_STYLES.profileCard}>
        <ProfileSectionTitle
          title="Dados Básicos"
          onIconClick={() => setShowBasic((v) => !v)}
          iconClickable
          expanded={showBasic}
        />
        {showBasic && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input icon={<FaUser />} placeholder="Nome" {...register('name')} />
            <Input
              icon={<FaBirthdayCake />}
              type="date"
              placeholder="Data de nascimento"
              {...register('birthday')}
            />
            <Input
              icon={<FaEnvelope />}
              placeholder="E-mail"
              value={user?.email}
              disabled
            />
          </div>
        )}
      </div>
      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Contatos" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            icon={<FaPhone />}
            placeholder="Telefone"
            {...register('candidateProfile.contacts.phone.number')}
          />
          <Input
            placeholder="País"
            {...register('candidateProfile.contacts.phone.country')}
          />
          <Input
            placeholder="Cidade"
            {...register('candidateProfile.contacts.address.city')}
          />
          <Input
            placeholder="Estado"
            {...register('candidateProfile.contacts.address.state')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Documentos" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            icon={<FaIdCard />}
            placeholder="CPF"
            {...register('candidateProfile.documents.cpf.number')}
          />
          <Input
            icon={<FaIdCard />}
            placeholder="RG"
            {...register('candidateProfile.documents.rg.number')}
          />
          <Input
            placeholder="Órgão emissor"
            {...register('candidateProfile.documents.rg.issuer')}
          />
          <Input
            placeholder="Estado do RG"
            {...register('candidateProfile.documents.rg.state')}
          />
          <Input
            placeholder="CREF"
            {...register('candidateProfile.documents.cref.number')}
          />
          <Input
            placeholder="Categoria CREF"
            {...register('candidateProfile.documents.cref.category')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Mídia" />
        <div className="mt-6">
          <Input
            placeholder="URL do currículo"
            {...register('candidateProfile.media.resumeUrl')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Etnia" />
        <div className="mt-6">
          <Select
            label="Etnia"
            options={Object.entries(EthnicityTypeEnum).map(([key, value]) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}
            {...register('candidateProfile.ethnicity')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Diversidade" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Select
            label="Identidade de Gênero"
            options={Object.entries(GenderIdentityEnum).map(([key, value]) => ({ value, label: value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))}
            {...register('candidateProfile.diversity.genderIdentity')}
          />
          <Select
            label="Orientação Sexual"
            options={Object.entries(SexualOrientationEnum).map(([key, value]) => ({ value, label: value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))}
            {...register('candidateProfile.diversity.sexualOrientation')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Atributos Físicos" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Altura (cm)"
            placeholder="Altura"
            type="number"
            min={0}
            step={1}
            {...register('candidateProfile.physicalAttributes.height')}
          />
          <Input
            label="Peso (kg)"
            placeholder="Peso"
            type="number"
            min={0}
            step={0.1}
            {...register('candidateProfile.physicalAttributes.weight')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Uniforme" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Select
            label="Tamanho Camiseta"
            options={Object.entries(ClothingSizeEnum).map(([key, value]) => ({ value, label: value.toUpperCase() }))}
            {...register('candidateProfile.uniform.tShirtSize')}
          />
          <Select
            label="Tamanho Jaqueta"
            options={Object.entries(ClothingSizeEnum).map(([key, value]) => ({ value, label: value.toUpperCase() }))}
            {...register('candidateProfile.uniform.jacketSize')}
          />
          <Select
            label="Tamanho Shorts"
            options={Object.entries(ClothingSizeEnum).map(([key, value]) => ({ value, label: value.toUpperCase() }))}
            {...register('candidateProfile.uniform.shortSize')}
          />
          <Select
            label="Tamanho Calça"
            options={Object.entries(ClothingSizeEnum).map(([key, value]) => ({ value, label: value.toUpperCase() }))}
            {...register('candidateProfile.uniform.pantsSize')}
          />
          <Input
            label="Tamanho do Calçado"
            placeholder="Calçado"
            type="number"
            min={0}
            step={0.5}
            {...register('candidateProfile.uniform.shoeSize')}
          />
          <Select
            label="Unidade do Calçado"
            options={Object.entries(ShoesSizeUnitEnum).map(([key, value]) => ({ value, label: value.toUpperCase() }))}
            {...register('candidateProfile.uniform.shoeSizeUnit')}
          />
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Formação" />
        <div className="mt-4 flex justify-center">
          <Button variant="green" icon={<FaGraduationCap />}>
            Adicionar Formação
          </Button>
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Experiências Profissionais" />
        <div className="mt-4 flex justify-center">
          <Button variant="green" icon={<FaBriefcase />}>
            Adicionar Experiência Profissional
          </Button>
        </div>
      </div>

      <div className={CARD_STYLES.featureBox}>
        <ProfileSectionTitle title="Disponibilidade" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(AvailabilityShiftEnum).map(([key, value]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={value}
                {...register('candidateProfile.availability')}
              />
              {(() => {
                switch (value) {
                  case 'early_morning': return 'Madrugada';
                  case 'morning': return 'Manhã';
                  case 'afternoon': return 'Tarde';
                  case 'evening': return 'Noite';
                  case 'night': return 'Madrugada (tarde)';
                  case 'full_day': return 'Dia inteiro';
                  case 'flexible': return 'Flexível';
                  default: return value;
                }
              })()}
            </label>
          ))}
        </div>
      </div>



      <Button
        type="submit"
        variant="positive"
        icon={<FaSave />}
        disabled={isSubmitting}
      >
        Salvar perfil
      </Button>
    </form>
  );
}
