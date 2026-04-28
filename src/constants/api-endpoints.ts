export const API_ENDPOINTS = {
  HEALTH_CHECK: '/health-check',

  AUTH_SIGN_UP: '/auth/sign-up',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_ME: '/auth/me',
  AUTH_ACTIVATION_CODE: '/auth/activation-code',
  AUTH_ACTIVATE_ACCOUNT: '/auth/activate-account',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_SIGN_OUT: '/auth/sign-out',

  COMPANY: '/company',

  JOB: '/job',
  JOB_BY_ID: (jobId: string) => `/job/${jobId}`,

  APPLY: '/apply',
  APPLY_BY_ID: (applyId: string) => `/apply/${applyId}`,
};
