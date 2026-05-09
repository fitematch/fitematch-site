export const API_ENDPOINTS = {
  HEALTH_CHECK: '/health-check',

  AUTH_SIGN_UP: '/auth/sign-up',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_ME: '/auth/me',
  AUTH_ACTIVATION_CODE: '/auth/activation-code',
  AUTH_ACTIVATE_ACCOUNT: '/auth/activate-account',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_SIGN_OUT: '/auth/sign-out',

  AUTH_SESSIONS: '/auth/sessions',
  AUTH_REVOKE_SESSION: (sessionId: string) => `/auth/sessions/${sessionId}/revoke`,

  UPLOAD_COMPANY_LOGO: '/upload/company-logo',
  UPLOAD_JOB_COVER: '/upload/job-cover',
  UPLOAD_RESUME: '/upload/candidate-resume',

  COMPANY: '/company',
  COMPANY_ME: '/company/me',
  COMPANY_PUBLIC: '/company/public',
  COMPANY_BY_ID: (companyId: string) => `/company/${companyId}`,

  USER: '/user',

  JOB: '/job',
  JOB_ME: '/job/me',
  JOB_ME_BY_ID: (jobId: string) => `/job/me/${jobId}`,
  JOB_BY_ID: (jobId: string) => `/job/${jobId}`,

  APPLY: '/apply',
  APPLY_ME: '/apply/me',
  APPLY_BY_ID: (applyId: string) => `/apply/${applyId}`,
  APPLY_BY_JOB_ID: (jobId: string) => `/apply/job/${jobId}`,
};
