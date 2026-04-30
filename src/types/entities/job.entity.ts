export enum LanguagesEnum {
  PORTUGUESE = 'portuguese',
  ENGLISH = 'english',
  SPANISH = 'spanish',
}

export enum LanguagesLevelEnum {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  FLUENT = 'fluent',
  NATIVE = 'native',
}

export enum EducationLevelEnum {
  HIGH_SCHOOL = 'high_school',
  TECHNICAL = 'technical',
  BACHELOR = 'bachelor',
  ASSOCIATE = 'associate',
  POSTGRADUATE = 'postgraduate',
  MBA = 'mba',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  EXTENSION = 'extension',
  OTHER = 'other',
}

export enum HardSkillsEnum {
  FUNCTIONAL_ASSESSMENT = 'functional_assessment',
  EXERCISE_PRESCRIPTION = 'exercise_prescription',
  STRENGTH_TRAINING = 'strength_training',
  HYPERTROPHY_TRAINING = 'hypertrophy_training',
  WEIGHT_LOSS_TRAINING = 'weight_loss_training',
  CARDIOVASCULAR_TRAINING = 'cardiovascular_training',
  MOBILITY_TRAINING = 'mobility_training',
  FLEXIBILITY_TRAINING = 'flexibility_training',
  GROUP_CLASSES = 'group_classes',
  FUNCTIONAL_TRAINING = 'functional_training',
  HIIT = 'hiit',
  PILATES = 'pilates',
  YOGA = 'yoga',
  INDOOR_CYCLING = 'indoor_cycling',
  PERSONAL_TRAINING = 'personal_training',
  SPORTS_CONDITIONING = 'sports_conditioning',
  REHABILITATION_SUPPORT = 'rehabilitation_support',
  POSTURAL_CORRECTION = 'postural_correction',
  BODY_COMPOSITION_ASSESSMENT = 'body_composition_assessment',
  ANTHROPOMETRIC_EVALUATION = 'anthropometric_evaluation',
  TRAINING_PERIODIZATION = 'training_periodization',
  WORKOUT_PLAN_DESIGN = 'workout_plan_design',
  EQUIPMENT_INSTRUCTION = 'equipment_instruction',
  FIRST_AID = 'first_aid',
  CPR = 'cpr',
  FITNESS_SOFTWARE = 'fitness_software',
  SALES_AND_MEMBERSHIP = 'sales_and_membership',
  NUTRITION_BASICS = 'nutrition_basics',
}

export enum SoftSkillsEnum {
  COMMUNICATION = 'communication',
  EMPATHY = 'empathy',
  LEADERSHIP = 'leadership',
  MOTIVATION = 'motivation',
  PROACTIVITY = 'proactivity',
  TEAMWORK = 'teamwork',
  ADAPTABILITY = 'adaptability',
  DISCIPLINE = 'discipline',
  ORGANIZATION = 'organization',
  TIME_MANAGEMENT = 'time_management',
  CUSTOMER_SERVICE = 'customer_service',
  ACTIVE_LISTENING = 'active_listening',
  CONFLICT_RESOLUTION = 'conflict_resolution',
  PROBLEM_SOLVING = 'problem_solving',
  RESILIENCE = 'resilience',
  PROFESSIONAL_ETHICS = 'professional_ethics',
  RESPONSIBILITY = 'responsibility',
  PATIENCE = 'patience',
  ATTENTION_TO_DETAIL = 'attention_to_detail',
  POSITIVE_ATTITUDE = 'positive_attitude',
}

export interface LanguageRequirement {
  name: LanguagesEnum;
  level: LanguagesLevelEnum;
}

export interface RequirementsEntity {
  educationLevel?: EducationLevelEnum[];
  minExperienceYears?: number;
  maxExperienceYears?: number;
  languages?: LanguageRequirement[];
  hardSkills?: {
    required?: HardSkillsEnum[];
    niceToHave?: HardSkillsEnum[];
  };
  softSkills?: {
    required?: SoftSkillsEnum[];
    niceToHave?: SoftSkillsEnum[];
  };
}

export interface BenefitsEntity {
  salary?: number;
  healthInsurance?: boolean;
  dentalInsurance?: boolean;
  alimentationVoucher?: boolean;
  transportationVoucher?: boolean;
}

export interface JobMediaEntity {
  coverUrl?: string;
}

export enum JobStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  DENIED = 'denied',
  CLOSED = 'closed',
}

export interface JobEntity {
  _id: string;
  slug: string;
  companyId: string;
  title: string;
  description: string;
  slots: number;
  requirements?: RequirementsEntity;
  benefits?: BenefitsEntity;
  media?: JobMediaEntity;
  contractType?: string;
  status: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
