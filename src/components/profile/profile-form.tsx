'use client';

import { useForm, useWatch, useFieldArray } from 'react-hook-form';
import {
  FaGlobeAmericas,
  FaPassport,
  FaPhoneSquare,
  FaRegTrashAlt,
  FaTelegramPlane,
  FaSave,
  FaTshirt,
  FaWhatsapp,
} from 'react-icons/fa';
import { FaFilePdf } from 'react-icons/fa6';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import {
  GiBodyHeight,
  GiBodySwapping,
  GiConverseShoe,
  GiGraduateCap,
  GiMonclerJacket,
  GiUnderwearShorts,
} from 'react-icons/gi';
import { PiPantsFill } from 'react-icons/pi';
import { GrCertificate, GrDocumentText } from 'react-icons/gr';
import { MdDiversity2, MdEventAvailable, MdOutlinePlace } from 'react-icons/md';
import { BsFiles } from 'react-icons/bs';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAddressByZipCode } from '@/hooks/use-address-by-zipcode';
import { useAuth } from '@/hooks/use-auth';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import {
  ProductRoleEnum,
  EthnicityTypeEnum,
  GenderIdentityEnum,
  SexualOrientationEnum,
  ClothingSizeEnum,
  ShoesSizeUnitEnum,
  AvailabilityShiftEnum,
  CourseTypeEnum,
} from '@/types/entities/user.entity';
import { RecruiterProfileForm } from './recruiter-profile-form';
import { ProfileSectionTitle } from './profile-section-title';

function formatBirthday(value?: string | Date) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('pt-BR');
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getEthnicityLabel(value: EthnicityTypeEnum) {
  return {
    [EthnicityTypeEnum.INDIGENOUS]: 'Indígena',
    [EthnicityTypeEnum.WHITE]: 'Branca',
    [EthnicityTypeEnum.BLACK]: 'Preta',
    [EthnicityTypeEnum.BROWN]: 'Parda',
    [EthnicityTypeEnum.ASIAN]: 'Amarela',
    [EthnicityTypeEnum.OTHER]: 'Outra',
  }[value];
}

function getGenderIdentityLabel(value: GenderIdentityEnum) {
  return {
    [GenderIdentityEnum.MALE]: 'Masculino',
    [GenderIdentityEnum.FEMALE]: 'Feminino',
    [GenderIdentityEnum.NON_BINARY]: 'Não binário',
    [GenderIdentityEnum.TRANS_MALE]: 'Homem trans',
    [GenderIdentityEnum.TRANS_FEMALE]: 'Mulher trans',
    [GenderIdentityEnum.AGENDER]: 'Agênero',
    [GenderIdentityEnum.GENDERFLUID]: 'Gênero fluido',
    [GenderIdentityEnum.GENDERQUEER]: 'Genderqueer',
    [GenderIdentityEnum.INTERSEX]: 'Intersexo',
    [GenderIdentityEnum.OTHER]: 'Outro',
    [GenderIdentityEnum.PREFER_NOT_TO_SAY]: 'Prefiro não informar',
  }[value];
}

function getSexualOrientationLabel(value: SexualOrientationEnum) {
  return {
    [SexualOrientationEnum.HETEROSEXUAL]: 'Heterossexual',
    [SexualOrientationEnum.HOMOSEXUAL]: 'Homossexual',
    [SexualOrientationEnum.LESBIAN]: 'Lésbica',
    [SexualOrientationEnum.GAY]: 'Gay',
    [SexualOrientationEnum.BISEXUAL]: 'Bissexual',
    [SexualOrientationEnum.PANSEXUAL]: 'Pansexual',
    [SexualOrientationEnum.ASEXUAL]: 'Assexual',
    [SexualOrientationEnum.DEMISEXUAL]: 'Demissexual',
    [SexualOrientationEnum.QUEER]: 'Queer',
    [SexualOrientationEnum.QUESTIONING]: 'Questionando',
    [SexualOrientationEnum.OTHER]: 'Outra',
    [SexualOrientationEnum.PREFER_NOT_TO_SAY]: 'Prefiro não informar',
  }[value];
}

function getAvailabilityShiftLabel(value: AvailabilityShiftEnum) {
  return {
    [AvailabilityShiftEnum.EARLY_MORNING]: 'Madrugada',
    [AvailabilityShiftEnum.MORNING]: 'Manhã',
    [AvailabilityShiftEnum.AFTERNOON]: 'Tarde',
    [AvailabilityShiftEnum.EVENING]: 'Noite',
    [AvailabilityShiftEnum.NIGHT]: 'Madrugada (tarde)',
    [AvailabilityShiftEnum.FULL_DAY]: 'Dia inteiro',
    [AvailabilityShiftEnum.FLEXIBLE]: 'Flexível',
  }[value];
}

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

import { useState } from 'react';

export function CandidateProfileForm() {
  const { user, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const {
    searchZipCode,
    clearError: clearZipCodeError,
    isLoading: isZipCodeLoading,
    error: zipCodeError,
  } = useAddressByZipCode();
  const currentYear = new Date().getFullYear();
  const courseTypeOptions = Object.values(CourseTypeEnum).map((value) => ({
    value,
    label: {
      [CourseTypeEnum.HIGH_SCHOOL]: 'Ensino Médio',
      [CourseTypeEnum.TECHNICAL]: 'Técnico',
      [CourseTypeEnum.TECHNOLOGIST]: 'Tecnólogo',
      [CourseTypeEnum.BACHELOR]: 'Bacharelado',
      [CourseTypeEnum.LICENTIATE]: 'Licenciatura',
      [CourseTypeEnum.POSTGRADUATE]: 'Pós-graduação',
      [CourseTypeEnum.MASTER]: 'Mestrado',
      [CourseTypeEnum.DOCTORATE]: 'Doutorado',
      [CourseTypeEnum.OTHER]: 'Outro',
    }[value],
  }));
  const [showBasic, setShowBasic] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showContacts, setShowContacts] = useState(true);
  const [showMedia, setShowMedia] = useState(true);
  const [showEthnicity, setShowEthnicity] = useState(true);
  const [showDiversity, setShowDiversity] = useState(true);
  const [showPhysicalAttributes, setShowPhysicalAttributes] = useState(true);
  const [showUniform, setShowUniform] = useState(true);
  const [showEducation, setShowEducation] = useState(true);
  const [showExperiences, setShowExperiences] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [educationIndexToDelete, setEducationIndexToDelete] = useState<number | null>(null);
  const [experienceIndexToDelete, setExperienceIndexToDelete] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [educationDraft, setEducationDraft] = useState({
    isOngoing: false,
    courseType: '',
    courseName: '',
    institution: '',
    startYear: currentYear,
    endYear: currentYear,
  });
  const [experienceDraft, setExperienceDraft] = useState({
    isCurrent: false,
    companyName: '',
    role: '',
    startYear: currentYear,
    endYear: currentYear,
  });
  const boxClassName = 'rounded-2xl border border-gray-500 bg-black p-6';
  const fieldClassName =
    'rounded-xl border border-gray-500 bg-black text-gray-300 placeholder:text-gray-500';
  const labelClassName = 'text-gray-300';

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name,
      birthday: user?.birthday,
      candidateProfile: user?.candidateProfile,
    },
  });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'candidateProfile.educations',
  });
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'candidateProfile.professionalExperiences',
  });
  const nextEducationNumber = String(educationFields.length + 1).padStart(2, '0');
  const nextExperienceNumber = String(experienceFields.length + 1).padStart(2, '0');
  const zipCodeField = register('candidateProfile.contacts.address.zipCode');

  async function submitCandidateUpdate(
    payload: UpdateMeRequest,
    successMessage: string,
    errorMessage: string
  ) {
    try {
      await updateMe(payload);
      showSuccess(successMessage);
      return true;
    } catch {
      showError(errorMessage);
      return false;
    }
  }

  const heightValue = useWatch({
    control,
    name: 'candidateProfile.physicalAttributes.height',
  });
  const weightValue = useWatch({
    control,
    name: 'candidateProfile.physicalAttributes.weight',
  });
  const shoeSizeValue = useWatch({
    control,
    name: 'candidateProfile.uniform.shoeSize',
  });
  const zipCodeValue = useWatch({
    control,
    name: 'candidateProfile.contacts.address.zipCode',
  });
  const shoeSizeUnitValue = useWatch({
    control,
    name: 'candidateProfile.uniform.shoeSizeUnit',
  });
  const hasShoeSizeUnit = Boolean(shoeSizeUnitValue);

  function updateNumericField(
    field:
      | 'candidateProfile.physicalAttributes.height'
      | 'candidateProfile.physicalAttributes.weight'
      | 'candidateProfile.uniform.shoeSize',
    currentValue: number | undefined,
    delta: number,
    min = 0,
    precision = 1
  ) {
    const nextValue = Math.max(
      min,
      Number((Number(currentValue || 0) + delta).toFixed(precision))
    );
    setValue(field, nextValue, { shouldDirty: true, shouldTouch: true });
  }

  async function handleZipCodeLookup(zipCode?: string) {
    const result = await searchZipCode(zipCode || '');

    if (!result) {
      return;
    }

    setValue('candidateProfile.contacts.address.street', result.street, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('candidateProfile.contacts.address.complement', result.complement, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue(
      'candidateProfile.contacts.address.neighborhood',
      result.neighborhood,
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );
    setValue('candidateProfile.contacts.address.city', result.city, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('candidateProfile.contacts.address.state', result.state, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  function updateEducationDraftYear(field: 'startYear' | 'endYear', delta: number) {
    setEducationDraft((current) => ({
      ...current,
      [field]: Math.max(1900, current[field] + delta),
    }));
  }

  function resetEducationDraft() {
    setEducationDraft({
      isOngoing: false,
      courseType: '',
      courseName: '',
      institution: '',
      startYear: currentYear,
      endYear: currentYear,
    });
  }

  function updateExperienceDraftYear(field: 'startYear' | 'endYear', delta: number) {
    setExperienceDraft((current) => ({
      ...current,
      [field]: Math.max(1900, current[field] + delta),
    }));
  }

  function resetExperienceDraft() {
    setExperienceDraft({
      isCurrent: false,
      companyName: '',
      role: '',
      startYear: currentYear,
      endYear: currentYear,
    });
  }

  function handleOpenEducationModal() {
    resetEducationDraft();
    setIsEducationModalOpen(true);
  }

  function handleOpenExperienceModal() {
    resetExperienceDraft();
    setIsExperienceModalOpen(true);
  }

  function handleSaveEducation() {
    if (!educationDraft.courseName.trim() || !educationDraft.institution.trim()) {
      showError('Preencha curso e instituição para salvar a formação.');
      return;
    }

    if (!educationDraft.courseType) {
      showError('Selecione o tipo de curso para salvar a formação.');
      return;
    }

    const nextEducation = {
      courseName: educationDraft.courseName.trim(),
      institution: educationDraft.institution.trim(),
      startYear: educationDraft.startYear,
      endYear: educationDraft.isOngoing ? undefined : educationDraft.endYear,
      courseType: educationDraft.courseType as CourseTypeEnum,
      isOngoing: educationDraft.isOngoing,
    };

    const nextEducations = [
      ...(getValues('candidateProfile.educations') || []),
      nextEducation,
    ];

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          educations: nextEducations,
        },
      },
      'Formação salva com sucesso.',
      'Não foi possível salvar a formação.'
    ).then((saved) => {
      if (!saved) {
        return;
      }

      appendEducation(nextEducation);
      setIsEducationModalOpen(false);
      resetEducationDraft();
    });
  }

  function handleSaveExperience() {
    if (!experienceDraft.companyName.trim() || !experienceDraft.role.trim()) {
      showError('Preencha empresa e cargo para salvar a experiência profissional.');
      return;
    }

    const nextExperience = {
      companyName: experienceDraft.companyName.trim(),
      role: experienceDraft.role.trim(),
      startYear: experienceDraft.startYear,
      endYear: experienceDraft.isCurrent ? undefined : experienceDraft.endYear,
      isCurrent: experienceDraft.isCurrent,
    };

    const nextExperiences = [
      ...(getValues('candidateProfile.professionalExperiences') || []),
      nextExperience,
    ];

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          professionalExperiences: nextExperiences,
        },
      },
      'Experiência profissional salva com sucesso.',
      'Não foi possível salvar a experiência profissional.'
    ).then((saved) => {
      if (!saved) {
        return;
      }

      appendExperience(nextExperience);
      setIsExperienceModalOpen(false);
      resetExperienceDraft();
    });
  }

  function handleSaveBasic() {
    void submitCandidateUpdate(
      { name: getValues('name') },
      'Dados básicos atualizados com sucesso.',
      'Não foi possível atualizar os dados básicos.'
    );
  }

  function handleSavePhone() {
    const phone = getValues('candidateProfile.contacts.phone');

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          contacts: {
            ...user?.candidateProfile?.contacts,
            phone: {
              ...user?.candidateProfile?.contacts?.phone,
              ...phone,
            },
          },
        },
      },
      'Telefone atualizado com sucesso.',
      'Não foi possível atualizar o telefone.'
    );
  }

  function handleSaveDocuments() {
    const documents = getValues('candidateProfile.documents');
    const nextDocuments = {
      ...(hasValue(documents?.rg?.number)
        ? {
            rg: {
              number: documents?.rg?.number,
              ...(hasValue(documents?.rg?.issuer) ? { issuer: documents?.rg?.issuer } : {}),
              ...(hasValue(documents?.rg?.state) ? { state: documents?.rg?.state } : {}),
            },
          }
        : {}),
      ...(hasValue(documents?.cpf?.number)
        ? {
            cpf: {
              number: documents?.cpf?.number,
            },
          }
        : {}),
      ...(hasValue(documents?.cref?.number) ||
      hasValue(documents?.cref?.category) ||
      documents?.cref?.isActive
        ? {
            cref: {
              ...(hasValue(documents?.cref?.number) ? { number: documents?.cref?.number } : {}),
              ...(hasValue(documents?.cref?.category)
                ? { category: documents?.cref?.category }
                : {}),
              ...(documents?.cref?.isActive ? { isActive: true } : {}),
            },
          }
        : {}),
      ...(hasValue(documents?.passport?.number) ||
      hasValue(documents?.passport?.country) ||
      hasValue(documents?.passport?.expirationDate)
        ? {
            passport: {
              ...(hasValue(documents?.passport?.number)
                ? { number: documents?.passport?.number }
                : {}),
              ...(hasValue(documents?.passport?.country)
                ? { country: documents?.passport?.country }
                : {}),
              ...(hasValue(documents?.passport?.expirationDate)
                ? { expirationDate: documents?.passport?.expirationDate }
                : {}),
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
      'Não foi possível atualizar os documentos.'
    );
  }

  function handleSaveAddress() {
    const address = getValues('candidateProfile.contacts.address');
    const nextAddress = {
      ...(hasValue(address?.zipCode) ? { zipCode: address?.zipCode } : {}),
      ...(hasValue(address?.street) ? { street: address?.street } : {}),
      ...(hasValue(address?.number) ? { number: address?.number } : {}),
      ...(hasValue(address?.complement) ? { complement: address?.complement } : {}),
      ...(hasValue(address?.neighborhood)
        ? { neighborhood: address?.neighborhood }
        : {}),
      ...(hasValue(address?.city) ? { city: address?.city } : {}),
      ...(hasValue(address?.state) ? { state: address?.state } : {}),
      ...(hasValue(address?.country) ? { country: address?.country } : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          contacts: {
            ...user?.candidateProfile?.contacts,
            ...(Object.keys(nextAddress).length > 0 ? { address: nextAddress } : {}),
          },
        },
      },
      'Endereço atualizado com sucesso.',
      'Não foi possível atualizar o endereço.'
    );
  }

  function handleSaveMedia() {
    showError('O upload de currículo ainda não está integrado ao salvamento da API.');
  }

  function handleSaveEthnicity() {
    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ethnicity: getValues('candidateProfile.ethnicity'),
        },
      },
      'Etnia atualizada com sucesso.',
      'Não foi possível atualizar a etnia.'
    );
  }

  function handleSaveDiversity() {
    const diversity = getValues('candidateProfile.diversity');
    const nextDiversity = {
      ...(hasValue(diversity?.genderIdentity)
        ? { genderIdentity: diversity?.genderIdentity }
        : {}),
      ...(hasValue(diversity?.sexualOrientation)
        ? { sexualOrientation: diversity?.sexualOrientation }
        : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ...(Object.keys(nextDiversity).length > 0 ? { diversity: nextDiversity } : {}),
        },
      },
      'Diversidade atualizada com sucesso.',
      'Não foi possível atualizar a diversidade.'
    );
  }

  function handleSavePhysicalAttributes() {
    const physicalAttributes = getValues('candidateProfile.physicalAttributes');
    const nextPhysicalAttributes = {
      ...(physicalAttributes?.height || physicalAttributes?.height === 0
        ? { height: physicalAttributes.height }
        : {}),
      ...(physicalAttributes?.weight || physicalAttributes?.weight === 0
        ? { weight: physicalAttributes.weight }
        : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ...(Object.keys(nextPhysicalAttributes).length > 0
            ? { physicalAttributes: nextPhysicalAttributes }
            : {}),
        },
      },
      'Atributos físicos atualizados com sucesso.',
      'Não foi possível atualizar os atributos físicos.'
    );
  }

  function handleSaveUniform() {
    const uniform = getValues('candidateProfile.uniform');
    const hasShoeUnit = hasValue(uniform?.shoeSizeUnit);
    const hasShoeSize = uniform?.shoeSize || uniform?.shoeSize === 0;

    if (hasShoeUnit !== Boolean(hasShoeSize)) {
      showError('Unidade do calçado e tamanho do calçado devem ser informados juntos.');
      return;
    }

    const nextUniform = {
      ...(hasValue(uniform?.tShirtSize) ? { tShirtSize: uniform?.tShirtSize } : {}),
      ...(hasValue(uniform?.jacketSize) ? { jacketSize: uniform?.jacketSize } : {}),
      ...(hasValue(uniform?.shortSize) ? { shortSize: uniform?.shortSize } : {}),
      ...(hasValue(uniform?.pantsSize) ? { pantsSize: uniform?.pantsSize } : {}),
      ...(hasShoeUnit ? { shoeSizeUnit: uniform?.shoeSizeUnit } : {}),
      ...(hasShoeSize ? { shoeSize: uniform?.shoeSize } : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ...(Object.keys(nextUniform).length > 0 ? { uniform: nextUniform } : {}),
        },
      },
      'Uniforme atualizado com sucesso.',
      'Não foi possível atualizar o uniforme.'
    );
  }

  function handleSaveAvailability() {
    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          availability: getValues('candidateProfile.availability') || [],
        },
      },
      'Disponibilidade atualizada com sucesso.',
      'Não foi possível atualizar a disponibilidade.'
    );
  }

  function handleDeleteEducation(index: number) {
    setEducationIndexToDelete(index);
  }

  function confirmDeleteEducation() {
    if (educationIndexToDelete === null) {
      return;
    }

    const currentEducations = getValues('candidateProfile.educations') || [];
    const nextEducations = currentEducations.filter(
      (_, itemIndex) => itemIndex !== educationIndexToDelete
    );

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          educations: nextEducations,
        },
      },
      'Formação apagada com sucesso.',
      'Não foi possível apagar a formação.'
    ).then((saved) => {
      if (!saved) {
        return;
      }

      removeEducation(educationIndexToDelete);
      setEducationIndexToDelete(null);
    });
  }

  function cancelDeleteEducation() {
    setEducationIndexToDelete(null);
  }

  function handleDeleteExperience(index: number) {
    setExperienceIndexToDelete(index);
  }

  function confirmDeleteExperience() {
    if (experienceIndexToDelete === null) {
      return;
    }

    const currentExperiences =
      getValues('candidateProfile.professionalExperiences') || [];
    const nextExperiences = currentExperiences.filter(
      (_, itemIndex) => itemIndex !== experienceIndexToDelete
    );

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          professionalExperiences: nextExperiences,
        },
      },
      'Experiência profissional apagada com sucesso.',
      'Não foi possível apagar a experiência profissional.'
    ).then((saved) => {
      if (!saved) {
        return;
      }

      removeExperience(experienceIndexToDelete);
      setExperienceIndexToDelete(null);
    });
  }

  function cancelDeleteExperience() {
    setExperienceIndexToDelete(null);
  }

  return (
    <form className="space-y-8">
        <div className={boxClassName}>
        <ProfileSectionTitle
          title="Dados Básicos"
          icon={GrDocumentText}
          onIconClick={() => setShowBasic((v) => !v)}
          iconClickable
          expanded={showBasic}
        />
        {showBasic && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input
              label="Nome"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="Nome"
              {...register('name')}
            />
            <div className="hidden md:block" />
            <Input
              label="E-mail"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="E-mail"
              value={user?.email || ''}
              disabled
            />
            <Input
              label="Data de nascimento"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="Data de nascimento"
              value={formatBirthday(user?.birthday)}
              disabled
            />
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveBasic}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Telefone"
          icon={FaPhoneSquare}
          onIconClick={() => setShowPhone((v) => !v)}
          iconClickable
          expanded={showPhone}
        />
        {showPhone && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Input
              label="Country"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="+55"
              {...register('candidateProfile.contacts.phone.country')}
            />
            <Input
              label="Number"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="11981726354"
              {...register('candidateProfile.contacts.phone.number')}
            />
            <div className="flex items-end">
              <div className="flex w-full gap-3">
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-100 placeholder:text-gray-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-gray-300"
                    {...register('candidateProfile.contacts.phone.isWhatsapp')}
                  />
                  <FaWhatsapp className="h-5 w-5 text-green-500" />
                  <span>WhatsApp</span>
                </label>
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-100 placeholder:text-gray-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-gray-300"
                    {...register('candidateProfile.contacts.phone.isTelegram')}
                  />
                  <FaTelegramPlane className="h-5 w-5 text-sky-500" />
                  <span>Telegram</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end md:col-span-3">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSavePhone}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Endereço"
          icon={MdOutlinePlace}
          onIconClick={() => setShowAddress((v) => !v)}
          iconClickable
          expanded={showAddress}
        />
        {showAddress && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input
              label="CEP"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="01310-100"
              {...zipCodeField}
              onChange={(event) => {
                clearZipCodeError();
                zipCodeField.onChange(event);
              }}
              onBlur={(event) => {
                zipCodeField.onBlur(event);
                void handleZipCodeLookup(event.target.value);
              }}
            />
            <div className="hidden md:block" />
            {isZipCodeLoading && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-300">Consultando CEP...</p>
              </div>
            )}
            {zipCodeError && (
              <div className="md:col-span-2">
                <p className="text-sm text-red-100">{zipCodeError}</p>
              </div>
            )}

            <Input
              label="Rua"
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="Avenida Paulista"
              {...register('candidateProfile.contacts.address.street')}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Número"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="1578"
                {...register('candidateProfile.contacts.address.number')}
              />
              <Input
                label="Complemento"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Conjunto 201"
                {...register('candidateProfile.contacts.address.complement')}
              />
            </div>

            <div className="contents md:hidden">
              <Input
                label="Bairro"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Bairro"
                {...register('candidateProfile.contacts.address.neighborhood')}
              />
              <Input
                label="Cidade"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Cidade"
                {...register('candidateProfile.contacts.address.city')}
              />
              <Input
                label="Estado"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Estado"
                {...register('candidateProfile.contacts.address.state')}
              />
              <Input
                label="País"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="País"
                {...register('candidateProfile.contacts.address.country')}
              />
            </div>
            <div className="hidden gap-4 md:grid md:grid-cols-2 md:col-span-2">
              <div className="grid gap-4 grid-cols-2">
                <Input
                  label="Bairro"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Bela Vista"
                  {...register('candidateProfile.contacts.address.neighborhood')}
                />
                <Input
                  label="Cidade"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="São Paulo"
                  {...register('candidateProfile.contacts.address.city')}
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <Input
                  label="Estado"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="SP"
                  {...register('candidateProfile.contacts.address.state')}
                />
                <Input
                  label="País"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Brasil"
                  {...register('candidateProfile.contacts.address.country')}
                />
              </div>
            </div>

            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveAddress}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Documentos"
          icon={FaPassport}
          onIconClick={() => setShowContacts((v) => !v)}
          iconClickable
          expanded={showContacts}
        />
        {showContacts && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-gray-500 bg-black p-4">
              <h3 className="mb-4 text-lg font-semibold uppercase text-gray-100">RG</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Número"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="45.678.901-2"
                  {...register('candidateProfile.documents.rg.number')}
                />
                <div className="hidden md:block" />
                <Input
                  label="Órgão Emissor"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="SSP-SP"
                  {...register('candidateProfile.documents.rg.issuer')}
                />
                <Input
                  label="Estado Emissor"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="SP"
                  {...register('candidateProfile.documents.rg.state')}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-500 bg-black p-4">
              <h3 className="mb-4 text-lg font-semibold uppercase text-gray-100">CPF</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Número"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="123.456.789-00"
                  {...register('candidateProfile.documents.cpf.number')}
                />
                <div className="hidden md:block" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-500 bg-black p-4">
              <h3 className="mb-4 text-lg font-semibold uppercase text-gray-100">CREF</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 self-end rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-gray-300"
                    {...register('candidateProfile.documents.cref.isActive')}
                  />
                  <span>Ativo</span>
                </label>
                <div className="hidden md:block" />
                <Input
                  label="CREF"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="123456-G/SP"
                  {...register('candidateProfile.documents.cref.number')}
                />
                <Input
                  label="Categoria CREF"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Provisório"
                  {...register('candidateProfile.documents.cref.category')}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-500 bg-black p-4">
              <h3 className="mb-4 text-lg font-semibold uppercase text-gray-100">
                Passaporte
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Código"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="AB123456"
                  {...register('candidateProfile.documents.passport.number')}
                />
                <div className="hidden md:block" />
                <Input
                  label="País"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Brasil"
                  {...register('candidateProfile.documents.passport.country')}
                />
                <Input
                  label="Validade"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="10/12/2030"
                  {...register('candidateProfile.documents.passport.expirationDate')}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveDocuments}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Mídia"
          icon={BsFiles}
          onIconClick={() => setShowMedia((v) => !v)}
          iconClickable
          expanded={showMedia}
        />
        {showMedia && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                URL do currículo em PDF
              </label>
              <label className="flex min-h-[50px] w-full cursor-pointer items-center justify-between rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-300">
                <span className="truncate text-sm">
                  {resumeFile ? resumeFile.name : 'Nenhum arquivo selecionado'}
                </span>
                <span className="flex shrink-0 items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-black">
                  <IoCloudUploadOutline className="h-4 w-4" />
                  <span>Choose File</span>
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(event) =>
                    setResumeFile(event.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-end">
              {resumeFile ? (
                <div className="flex min-h-[50px] w-full items-center gap-3 px-1 py-3 text-gray-100">
                  <FaFilePdf className="h-5 w-5 shrink-0 text-current" />
                  <span className="truncate">
                    {resumeFile.name} - {formatFileSize(resumeFile.size)}
                  </span>
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveMedia}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Etnia"
          icon={FaGlobeAmericas}
          onIconClick={() => setShowEthnicity((v) => !v)}
          iconClickable
          expanded={showEthnicity}
        />
        {showEthnicity && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Select
              label="Etnia"
              labelClassName={labelClassName}
              className={fieldClassName}
              options={Object.values(EthnicityTypeEnum).map((value) => ({
                value,
                label: getEthnicityLabel(value),
              }))}
              {...register('candidateProfile.ethnicity')}
            />
            <div className="hidden md:block" />
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveEthnicity}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Diversidade"
          icon={MdDiversity2}
          onIconClick={() => setShowDiversity((v) => !v)}
          iconClickable
          expanded={showDiversity}
        />
        {showDiversity && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Select
              label="Identidade de Gênero"
              labelClassName={labelClassName}
              className={fieldClassName}
              options={Object.values(GenderIdentityEnum).map((value) => ({
                value,
                label: getGenderIdentityLabel(value),
              }))}
              {...register('candidateProfile.diversity.genderIdentity')}
            />
            <Select
              label="Orientação Sexual"
              labelClassName={labelClassName}
              className={fieldClassName}
              options={Object.values(SexualOrientationEnum).map((value) => ({
                value,
                label: getSexualOrientationLabel(value),
              }))}
              {...register('candidateProfile.diversity.sexualOrientation')}
            />
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveDiversity}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Atributos Físicos"
          icon={GiBodyHeight}
          onIconClick={() => setShowPhysicalAttributes((v) => !v)}
          iconClickable
          expanded={showPhysicalAttributes}
        />
        {showPhysicalAttributes && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                Altura (cm)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.height',
                      heightValue,
                      -0.01,
                      0,
                      2
                    )
                  }
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                  aria-label="Diminuir altura"
                >
                  <FiMinusCircle className="h-6 w-6" />
                </button>
                <div className={`${fieldClassName} flex h-[50px] flex-1 items-center rounded-xl px-4`}>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full bg-transparent text-center text-gray-300 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="1.60"
                    {...register('candidateProfile.physicalAttributes.height', {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="ml-2 shrink-0 text-sm font-medium text-gray-300">
                    CM
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.height',
                      heightValue,
                      0.01,
                      0,
                      2
                    )
                  }
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                  aria-label="Aumentar altura"
                >
                  <FiPlusCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                Peso (kg)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.weight',
                      weightValue,
                      -0.01,
                      0,
                      2
                    )
                  }
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                  aria-label="Diminuir peso"
                >
                  <FiMinusCircle className="h-6 w-6" />
                </button>
                <div className={`${fieldClassName} flex h-[50px] flex-1 items-center rounded-xl px-4`}>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full bg-transparent text-center text-gray-300 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="70"
                    {...register('candidateProfile.physicalAttributes.weight', {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="ml-2 shrink-0 text-sm font-medium text-gray-300">
                    KG
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.weight',
                      weightValue,
                      0.01,
                      0,
                      2
                    )
                  }
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                  aria-label="Aumentar peso"
                >
                  <FiPlusCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSavePhysicalAttributes}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Uniforme"
          icon={GiBodySwapping}
          onIconClick={() => setShowUniform((v) => !v)}
          iconClickable
          expanded={showUniform}
        />
        {showUniform && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Tamanho Camiseta"
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={FaTshirt}
              options={Object.values(ClothingSizeEnum).map((value) => ({ value, label: value.toUpperCase() }))}
              {...register('candidateProfile.uniform.tShirtSize')}
            />
            <Select
              label="Tamanho Jaqueta"
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={GiMonclerJacket}
              options={Object.values(ClothingSizeEnum).map((value) => ({ value, label: value.toUpperCase() }))}
              {...register('candidateProfile.uniform.jacketSize')}
            />
            <Select
              label="Tamanho Shorts"
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={GiUnderwearShorts}
              options={Object.values(ClothingSizeEnum).map((value) => ({ value, label: value.toUpperCase() }))}
              {...register('candidateProfile.uniform.shortSize')}
            />
            <Select
              label="Tamanho Calça"
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={PiPantsFill}
              options={Object.values(ClothingSizeEnum).map((value) => ({ value, label: value.toUpperCase() }))}
              {...register('candidateProfile.uniform.pantsSize')}
            />
            <Select
              label="Unidade do Calçado"
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={GiConverseShoe}
              options={Object.values(ShoesSizeUnitEnum).map((value) => ({ value, label: value.toUpperCase() }))}
              {...register('candidateProfile.uniform.shoeSizeUnit')}
            />
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                Tamanho do Calçado
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!hasShoeSizeUnit}
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.uniform.shoeSize',
                      shoeSizeValue,
                      -1,
                      0,
                      0
                    )
                  }
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Diminuir calçado"
                >
                  <FiMinusCircle className="h-6 w-6" />
                </button>
                <div className={`${fieldClassName} flex h-[50px] flex-1 items-center rounded-xl px-4 ${!hasShoeSizeUnit ? 'opacity-60' : ''}`}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    disabled={!hasShoeSizeUnit}
                    className="w-full bg-transparent text-center text-gray-300 outline-none appearance-none disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="36"
                    {...register('candidateProfile.uniform.shoeSize', {
                      valueAsNumber: true,
                      validate: (value) => {
                        if ((value || value === 0) && !shoeSizeUnitValue) {
                          return 'E necessario escolher uma unidade de calcado antes.';
                        }

                        return true;
                      },
                    })}
                  />
                  {shoeSizeUnitValue && (
                    <span className="ml-2 shrink-0 text-sm font-medium uppercase text-gray-300">
                      {shoeSizeUnitValue}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!hasShoeSizeUnit}
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.uniform.shoeSize',
                      shoeSizeValue,
                      1,
                      0,
                      0
                    )
                  }
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Aumentar calçado"
                >
                  <FiPlusCircle className="h-6 w-6" />
                </button>
              </div>
              {errors.candidateProfile?.uniform?.shoeSize?.message && (
                <p className="mt-2 text-sm text-red-100">
                  {errors.candidateProfile.uniform.shoeSize.message}
                </p>
              )}
            </div>
            <div className="flex justify-end md:col-span-2 lg:col-span-3">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveUniform}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Formação"
          icon={GiGraduateCap}
          onIconClick={() => setShowEducation((v) => !v)}
          iconClickable
          expanded={showEducation}
        />
        {showEducation && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-start">
              <Button
                type="button"
                variant="login"
                icon={<FiPlusCircle />}
                onClick={handleOpenEducationModal}
              >
                Adicionar Formação
              </Button>
            </div>
            {educationFields.map((education, index) => (
              <div
                key={education.id}
                className="grid gap-4 rounded-2xl border border-gray-500 bg-black p-6 md:grid-cols-2"
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold uppercase text-gray-100">
                    {`Formação ${String(index + 1).padStart(2, '0')}`}
                  </h3>
                </div>
                <Input
                  label="Cursando"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.isOngoing ? 'Sim' : 'Não'}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label="Curso"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.courseName}
                  disabled
                />
                <Input
                  label="Instituição"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.institution}
                  disabled
                />
                <Input
                  label="Ano de início"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(education.startYear)}
                  disabled
                />
                <Input
                  label="Ano de término"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.isOngoing ? 'Cursando' : String(education.endYear || '')}
                  disabled
                />
                <div className="flex justify-end md:col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    icon={<FaRegTrashAlt />}
                    disabled={isSubmitting}
                    onClick={() => handleDeleteEducation(index)}
                  >
                    {`Apagar Formação ${String(index + 1).padStart(2, '0')}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Experiências Profissionais"
          icon={GrCertificate}
          onIconClick={() => setShowExperiences((v) => !v)}
          iconClickable
          expanded={showExperiences}
        />
        {showExperiences && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-start">
              <Button
                type="button"
                variant="login"
                icon={<FiPlusCircle />}
                onClick={handleOpenExperienceModal}
              >
                Adicionar Experiência Profissional
              </Button>
            </div>
            {experienceFields.map((experience, index) => (
              <div
                key={experience.id}
                className="grid gap-4 rounded-2xl border border-gray-500 bg-black p-6 md:grid-cols-2"
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold uppercase text-gray-100">
                    {`Experiência Profissional ${String(index + 1).padStart(2, '0')}`}
                  </h3>
                </div>
                <Input
                  label="Atual"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.isCurrent ? 'Sim' : 'Não'}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label="Empresa"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.companyName}
                  disabled
                />
                <Input
                  label="Cargo"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.role}
                  disabled
                />
                <Input
                  label="Ano de início"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(experience.startYear)}
                  disabled
                />
                <Input
                  label="Ano de término"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.isCurrent ? 'Atual' : String(experience.endYear || '')}
                  disabled
                />
                <div className="flex justify-end md:col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    icon={<FaRegTrashAlt />}
                    disabled={isSubmitting}
                    onClick={() => handleDeleteExperience(index)}
                  >
                    {`Apagar Experiência Profissional ${String(index + 1).padStart(2, '0')}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={boxClassName}>
        <ProfileSectionTitle
          title="Disponibilidade"
          icon={MdEventAvailable}
          onIconClick={() => setShowAvailability((v) => !v)}
          iconClickable
          expanded={showAvailability}
        />
        {showAvailability && (
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {Object.values(AvailabilityShiftEnum).map((value) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={value}
                  {...register('candidateProfile.availability')}
                />
                {getAvailabilityShiftLabel(value)}
              </label>
            ))}
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<FaSave />}
                disabled={isSubmitting}
                onClick={handleSaveAvailability}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      {isEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <GiGraduateCap className="h-5 w-5 shrink-0" />
                <h2>{`CADASTRAR FORMAÇÃO ${nextEducationNumber}`}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEducationModalOpen(false)}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 self-end rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-gray-300"
                  checked={educationDraft.isOngoing}
                  onChange={(event) =>
                    setEducationDraft((current) => ({
                      ...current,
                      isOngoing: event.target.checked,
                    }))
                  }
                />
                <span>Cursando</span>
              </label>
              <Select
                label="Tipo de curso"
                labelClassName={labelClassName}
                className={fieldClassName}
                options={courseTypeOptions}
                value={educationDraft.courseType}
                onChange={(event) =>
                  setEducationDraft((current) => ({
                    ...current,
                    courseType: event.target.value,
                  }))
                }
              />

              <Input
                label="Curso"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Curso"
                value={educationDraft.courseName}
                onChange={(event) =>
                  setEducationDraft((current) => ({
                    ...current,
                    courseName: event.target.value,
                  }))
                }
              />
              <Input
                label="Instituição"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Instituição"
                value={educationDraft.institution}
                onChange={(event) =>
                  setEducationDraft((current) => ({
                    ...current,
                    institution: event.target.value,
                  }))
                }
              />

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  Ano de início
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('startYear', -1)}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                    aria-label="Diminuir ano de início"
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={educationDraft.startYear}
                    onChange={(event) =>
                      setEducationDraft((current) => ({
                        ...current,
                        startYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('startYear', 1)}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                    aria-label="Aumentar ano de início"
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  {educationDraft.isOngoing ? 'Previsão de término' : 'Ano de término'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('endYear', -1)}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                    aria-label="Diminuir ano de término"
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={educationDraft.endYear}
                    onChange={(event) =>
                      setEducationDraft((current) => ({
                        ...current,
                        endYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('endYear', 1)}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                    aria-label="Aumentar ano de término"
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button
                  type="button"
                  variant="positive"
                  icon={<FaSave />}
                  onClick={handleSaveEducation}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <FaSave className="h-5 w-5 shrink-0" />
                <h2>{`CADASTRAR EXPERIÊNCIA PROFISSIONAL ${nextExperienceNumber}`}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsExperienceModalOpen(false)}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 self-end rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-gray-300"
                  checked={experienceDraft.isCurrent}
                  onChange={(event) =>
                    setExperienceDraft((current) => ({
                      ...current,
                      isCurrent: event.target.checked,
                    }))
                  }
                />
                <span>Atual</span>
              </label>
              <div className="hidden md:block" />

              <Input
                label="Empresa"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Empresa"
                value={experienceDraft.companyName}
                onChange={(event) =>
                  setExperienceDraft((current) => ({
                    ...current,
                    companyName: event.target.value,
                  }))
                }
              />
              <Input
                label="Cargo"
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Cargo"
                value={experienceDraft.role}
                onChange={(event) =>
                  setExperienceDraft((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
              />

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  Ano de início
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('startYear', -1)}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                    aria-label="Diminuir ano de início da experiência"
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={experienceDraft.startYear}
                    onChange={(event) =>
                      setExperienceDraft((current) => ({
                        ...current,
                        startYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('startYear', 1)}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300"
                    aria-label="Aumentar ano de início da experiência"
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  Ano de término
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('endYear', -1)}
                    disabled={experienceDraft.isCurrent}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Diminuir ano de término da experiência"
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    disabled={experienceDraft.isCurrent}
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={experienceDraft.isCurrent ? currentYear : experienceDraft.endYear}
                    onChange={(event) =>
                      setExperienceDraft((current) => ({
                        ...current,
                        endYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('endYear', 1)}
                    disabled={experienceDraft.isCurrent}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Aumentar ano de término da experiência"
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button
                  type="button"
                  variant="positive"
                  icon={<FaSave />}
                  onClick={handleSaveExperience}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {educationIndexToDelete !== null && educationFields[educationIndexToDelete] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <FaRegTrashAlt className="h-5 w-5 shrink-0" />
                <h2>
                  {`APAGAR FORMAÇÃO ${String(educationIndexToDelete + 1).padStart(2, '0')}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={cancelDeleteEducation}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Confirme a exclusão da formação abaixo.
              </p>

              <div className="grid gap-4 rounded-2xl border border-gray-500 bg-black p-6 md:grid-cols-2">
                <Input
                  label="Cursando"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={educationFields[educationIndexToDelete].isOngoing ? 'Sim' : 'Não'}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label="Curso"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={educationFields[educationIndexToDelete].courseName}
                  disabled
                />
                <Input
                  label="Instituição"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={educationFields[educationIndexToDelete].institution}
                  disabled
                />
                <Input
                  label="Ano de início"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(educationFields[educationIndexToDelete].startYear)}
                  disabled
                />
                <Input
                  label="Ano de término"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={
                    educationFields[educationIndexToDelete].isOngoing
                      ? 'Cursando'
                      : String(educationFields[educationIndexToDelete].endYear || '')
                  }
                  disabled
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="profile"
                  onClick={cancelDeleteEducation}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaRegTrashAlt />}
                  disabled={isSubmitting}
                  onClick={confirmDeleteEducation}
                >
                  {`Apagar Formação ${String(educationIndexToDelete + 1).padStart(2, '0')}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {experienceIndexToDelete !== null && experienceFields[experienceIndexToDelete] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-500 bg-black p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-xl font-semibold uppercase text-gray-100">
                <FaRegTrashAlt className="h-5 w-5 shrink-0" />
                <h2>
                  {`APAGAR EXPERIÊNCIA PROFISSIONAL ${String(
                    experienceIndexToDelete + 1
                  ).padStart(2, '0')}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={cancelDeleteExperience}
                className="text-2xl leading-none text-gray-300 transition-colors hover:text-gray-100"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Confirme a exclusão da experiência profissional abaixo.
              </p>

              <div className="grid gap-4 rounded-2xl border border-gray-500 bg-black p-6 md:grid-cols-2">
                <Input
                  label="Atual"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experienceFields[experienceIndexToDelete].isCurrent ? 'Sim' : 'Não'}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label="Empresa"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experienceFields[experienceIndexToDelete].companyName}
                  disabled
                />
                <Input
                  label="Cargo"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experienceFields[experienceIndexToDelete].role}
                  disabled
                />
                <Input
                  label="Ano de início"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(experienceFields[experienceIndexToDelete].startYear)}
                  disabled
                />
                <Input
                  label="Ano de término"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={
                    experienceFields[experienceIndexToDelete].isCurrent
                      ? 'Atual'
                      : String(experienceFields[experienceIndexToDelete].endYear || '')
                  }
                  disabled
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="profile"
                  onClick={cancelDeleteExperience}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaRegTrashAlt />}
                  disabled={isSubmitting}
                  onClick={confirmDeleteExperience}
                >
                  {`Apagar Experiência Profissional ${String(
                    experienceIndexToDelete + 1
                  ).padStart(2, '0')}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
