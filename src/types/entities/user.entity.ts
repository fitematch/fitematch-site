export interface PhoneEntity {
  country?: string;
  number?: string;
  isWhatsapp?: boolean;
  isTelegram?: boolean;
}

export interface AddressEntity {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface SocialEntity {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface CandidateContactsEntity {
  phone?: PhoneEntity;
  address?: AddressEntity;
  social?: SocialEntity;
}

export interface RecruiterContactsEntity {
  phone?: PhoneEntity;
}

export interface CandidateDocumentRGEntity {
  number: string;
  issuer: string;
  state: string;
}

export interface CandidateDocumentCPFEntity {
  number: string;
}

export interface CandidateDocumentCREFEntity {
  number: string;
  category: string;
  isActive: boolean;
}

export interface CandidateDocumentPassportEntity {
  number: string;
  country: string;
  expirationDate: Date;
}

export interface CandidateDocumentsEntity {
  rg?: CandidateDocumentRGEntity;
  cpf?: CandidateDocumentCPFEntity;
  cref?: CandidateDocumentCREFEntity;
  passport?: CandidateDocumentPassportEntity;
}

export interface CandidateMediaEntity {
  resumeUrl?: string;
}

export enum GenderIdentityEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  TRANS_MALE = 'trans_male',
  TRANS_FEMALE = 'trans_female',
  AGENDER = 'agender',
  GENDERFLUID = 'genderfluid',
  GENDERQUEER = 'genderqueer',
  INTERSEX = 'intersex',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum SexualOrientationEnum {
  HETEROSEXUAL = 'heterosexual',
  HOMOSEXUAL = 'homosexual',
  LESBIAN = 'lesbian',
  GAY = 'gay',
  BISEXUAL = 'bisexual',
  PANSEXUAL = 'pansexual',
  ASEXUAL = 'asexual',
  DEMISEXUAL = 'demisexual',
  QUEER = 'queer',
  QUESTIONING = 'questioning',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export interface DiversityEntity {
  genderIdentity?: GenderIdentityEnum;
  sexualOrientation?: SexualOrientationEnum;
}

export interface PhysicalAttributesEntity {
  height?: number;
  weight?: number;
}

export enum ClothingSizeEnum {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
  XXL = 'xxl',
}

export enum ShoesSizeUnitEnum {
  BR = 'br',
  US = 'us',
  EU = 'eu',
}

export interface UniformEntity {
  tShirtSize?: ClothingSizeEnum;
  jacketSize?: ClothingSizeEnum;
  shortSize?: ClothingSizeEnum;
  pantsSize?: ClothingSizeEnum;
  shoeSize?: number;
  shoeSizeUnit?: ShoesSizeUnitEnum;
}

export enum CourseTypeEnum {
  HIGH_SCHOOL = 'high_school',
  TECHNICAL = 'technical',
  TECHNOLOGIST = 'technologist',
  BACHELOR = 'bachelor',
  LICENTIATE = 'licentiate',
  POSTGRADUATE = 'postgraduate',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  OTHER = 'other',
}

export interface EducationEntity {
  courseName: string;
  institution: string;
  startYear: number;
  endYear?: number;
  courseType: CourseTypeEnum;
  isOngoing: boolean;
}

export interface ProfessionalExperienceEntity {
  companyName: string;
  role: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
}

export enum EthnicityTypeEnum {
  INDIGENOUS = 'indigenous',
  WHITE = 'white',
  BLACK = 'black',
  BROWN = 'brown',
  ASIAN = 'asian',
  OTHER = 'other',
}

export enum AvailabilityShiftEnum {
  EARLY_MORNING = 'early_morning',
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night',
  FULL_DAY = 'full_day',
  FLEXIBLE = 'flexible',
}

export interface CandidateProfileEntity {
  documents?: CandidateDocumentsEntity;
  contacts?: CandidateContactsEntity;
  media?: CandidateMediaEntity;
  ethnicity?: EthnicityTypeEnum;
  diversity?: DiversityEntity;
  physicalAttributes?: PhysicalAttributesEntity;
  uniform?: UniformEntity;
  educations?: EducationEntity[];
  professionalExperiences?: ProfessionalExperienceEntity[];
  availability?: AvailabilityShiftEnum[];
}

export interface RecruiterProfileEntity {
  companyId?: string;
  tradeName?: string;
  company?: {
    tradeName?: string;
  };
  position?: string;
  contacts?: RecruiterContactsEntity;
}

export enum ProductRoleEnum {
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
}

export enum AdminRoleEnum {
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export interface UserEntity {
  _id: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
  productRole: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
