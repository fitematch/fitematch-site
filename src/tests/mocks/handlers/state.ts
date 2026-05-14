import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApplicationStatusEnum } from '@/types/entities/apply.entity';
import { CompanyStatusEnum } from '@/types/entities/company.entity';
import { JobStatusEnum } from '@/types/entities/job.entity';
import { ProductRoleEnum, UserStatusEnum } from '@/types/entities/user.entity';

export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:3000'
).replace(/\/+$/, '');

export function apiUrl(endpoint: string) {
  return `${apiBaseUrl}/${endpoint.replace(/^\/+/, '')}`;
}

const baseUser = {
  _id: 'user-1',
  name: 'Rebeca Chambers',
  email: 'rebeca@fitematch.com',
  birthday: '1980-02-03',
  productRole: ProductRoleEnum.CANDIDATE,
  status: UserStatusEnum.ACTIVE,
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-05-01T10:00:00.000Z',
};

const baseCompany = {
  _id: 'company-1',
  slug: 'smart-fit',
  tradeName: 'Smart Fit',
  legalName: 'Smart Fit Academia LTDA',
  contacts: {
    email: 'contato@smartfit.com',
    website: 'https://smartfit.com',
    phone: {
      country: '+55',
      number: '11999999999',
    },
    address: {
      street: 'Rua da Academia',
      number: '100',
      city: 'São Paulo',
      state: 'SP',
      country: 'BR',
      zipCode: '01000-000',
    },
  },
  documents: {
    cnpj: '12.345.678/0001-99',
    isVerified: true,
  },
  media: {
    logoUrl: '/uploads/company/logo.png',
  },
  status: CompanyStatusEnum.ACTIVE,
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-05-01T10:00:00.000Z',
};

const baseJob = {
  _id: 'job-1',
  slug: 'personal-trainer-sao-paulo',
  companyId: 'company-1',
  title: 'Personal Trainer',
  description: 'Atendimento de alunos e prescrição de treinos.',
  slots: 2,
  contractType: 'clt',
  company: baseCompany,
  status: JobStatusEnum.ACTIVE,
  benefits: {
    salary: 3500,
  },
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-05-02T10:00:00.000Z',
};

const baseApply = {
  _id: 'apply-1',
  jobId: 'job-1',
  userId: 'user-1',
  user: {
    name: 'Rebeca Chambers',
    birthday: '1980-02-03',
    resumeUrl: '/uploads/resumes/user-1/resume.pdf',
  },
  status: ApplicationStatusEnum.APPLIED,
  createdAt: '2026-05-03T10:00:00.000Z',
  updatedAt: '2026-05-03T10:00:00.000Z',
};

export interface MockDb {
  dashboard: {
    summaryStatus: number;
    summary: {
      users: {
        total: number;
        lastWeek: number;
      };
      companies: {
        total: number;
        lastWeek: number;
      };
      jobs: {
        total: number;
        lastWeek: number;
      };
      applications: {
        total: number;
        lastWeek: number;
      };
    };
  };
  auth: {
    signInStatus: number;
    signInErrorMessage: string;
    meStatus: number;
    meUser: typeof baseUser | null;
    signOutStatus: number;
    signOutMessage: string;
    sessionsStatus: number;
    sessionsErrorMessage: string;
    sessions: Array<{
      id: string;
      userId: string;
      userAgent?: string;
      ipAddress?: string;
      expiresAt: string;
      revokedAt?: string;
      createdAt?: string;
      updatedAt?: string;
    }>;
  };
  company: {
    mineStatus: number;
    mine: typeof baseCompany | null;
    publicStatus: number;
    publicErrorMessage: string;
    publicList: Array<typeof baseCompany>;
  };
  job: {
    listStatus: number;
    listErrorMessage: string;
    list: Array<typeof baseJob>;
    mineStatus: number;
    mine: Array<typeof baseJob>;
  };
  apply: {
    listStatus: number;
    mine: Array<typeof baseApply>;
    createStatus: number;
    errorMessage: string;
  };
  upload: {
    lastUpload: {
      endpoint: string;
      fileName: string;
      fileType: string;
      contentType: string | null;
    } | null;
  };
}

export const mockDb: MockDb = {} as MockDb;

export function resetMockDb() {
  mockDb.dashboard = {
    summaryStatus: 200,
    summary: {
      users: {
        total: 3,
        lastWeek: 3,
      },
      companies: {
        total: 1,
        lastWeek: 1,
      },
      jobs: {
        total: 3,
        lastWeek: 3,
      },
      applications: {
        total: 2,
        lastWeek: 2,
      },
    },
  };

  mockDb.auth = {
    signInStatus: 200,
    signInErrorMessage: 'Credenciais inválidas.',
    meStatus: 200,
    meUser: { ...baseUser },
    signOutStatus: 200,
    signOutMessage: 'Sessão encerrada com sucesso.',
    sessionsStatus: 200,
    sessionsErrorMessage: 'Não foi possível carregar suas sessões.',
    sessions: [
      {
        id: 'session-1',
        userId: 'user-1',
        userAgent: 'Chrome',
        ipAddress: '127.0.0.1',
        expiresAt: '2026-05-10T10:00:00.000Z',
        createdAt: '2026-05-01T10:00:00.000Z',
        updatedAt: '2026-05-01T10:00:00.000Z',
      },
    ],
  };

  mockDb.company = {
    mineStatus: 200,
    mine: {
      ...baseCompany,
      contacts: {
        ...baseCompany.contacts,
        address: { ...baseCompany.contacts.address },
        phone: { ...baseCompany.contacts.phone },
      },
      documents: { ...baseCompany.documents },
      media: { ...baseCompany.media },
    },
    publicStatus: 200,
    publicErrorMessage: 'Não foi possível carregar as empresas.',
    publicList: [
      {
        ...baseCompany,
        contacts: {
          ...baseCompany.contacts,
          address: { ...baseCompany.contacts.address },
          phone: { ...baseCompany.contacts.phone },
        },
        documents: { ...baseCompany.documents },
        media: { ...baseCompany.media },
      },
    ],
  };

  const companyCopy = mockDb.company.mine || baseCompany;
  const jobCopy = {
    ...baseJob,
    company: companyCopy,
    benefits: { ...baseJob.benefits },
  };

  mockDb.job = {
    listStatus: 200,
    listErrorMessage: 'Não foi possível carregar as vagas.',
    list: [jobCopy],
    mineStatus: 200,
    mine: [jobCopy],
  };

  mockDb.apply = {
    listStatus: 200,
    mine: [{ ...baseApply, user: { ...baseApply.user } }],
    createStatus: 201,
    errorMessage: 'Candidatura não encontrada.',
  };

  mockDb.upload = {
    lastUpload: null,
  };
}

resetMockDb();

export { API_ENDPOINTS };
