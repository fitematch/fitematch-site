import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import { TokenStorage } from '@/services/http/token-storage';
import {
  ActivateAccountRequest,
  ActivateAccountResponse,
  AuthMeResponse,
  RefreshTokenResponse,
  RequestActivationCodeRequest,
  RequestActivationCodeResponse,
  SignInRequest,
  SignInResponse,
  SignOutResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateMeRequest,
  UpdateMeResponse,
} from './auth.types';

export const AuthService = {
  async signUp(payload: SignUpRequest): Promise<SignUpResponse> {
    return apiClient<SignUpResponse>(API_ENDPOINTS.AUTH_SIGN_UP, {
      method: 'POST',
      auth: false,
      body: JSON.stringify(payload),
    });
  },

  async signIn(payload: SignInRequest): Promise<SignInResponse> {
    const response = await apiClient<SignInResponse>(API_ENDPOINTS.AUTH_SIGN_IN, {
      method: 'POST',
      auth: false,
      body: JSON.stringify(payload),
    });

    TokenStorage.setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  async me(): Promise<AuthMeResponse> {
    return apiClient<AuthMeResponse>(API_ENDPOINTS.AUTH_ME);
  },

  async updateMe(payload: UpdateMeRequest): Promise<UpdateMeResponse> {
    return apiClient<UpdateMeResponse>(API_ENDPOINTS.AUTH_ME, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async requestActivationCode(
    payload: RequestActivationCodeRequest,
  ): Promise<RequestActivationCodeResponse> {
    return apiClient<RequestActivationCodeResponse>(
      API_ENDPOINTS.AUTH_ACTIVATION_CODE,
      {
        method: 'POST',
        auth: false,
        body: JSON.stringify(payload),
      },
    );
  },

  async activateAccount(
    payload: ActivateAccountRequest,
  ): Promise<ActivateAccountResponse> {
    return apiClient<ActivateAccountResponse>(
      API_ENDPOINTS.AUTH_ACTIVATE_ACCOUNT,
      {
        method: 'POST',
        auth: false,
        body: JSON.stringify(payload),
      },
    );
  },

  async refresh(): Promise<RefreshTokenResponse> {
    const refreshToken = TokenStorage.getRefreshToken();

    const response = await apiClient<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH_REFRESH,
      {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ refreshToken }),
      },
    );

    TokenStorage.setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  async signOut(): Promise<SignOutResponse> {
    try {
      return await apiClient<SignOutResponse>(API_ENDPOINTS.AUTH_SIGN_OUT, {
        method: 'POST',
      });
    } finally {
      TokenStorage.clearTokens();
    }
  },
};
