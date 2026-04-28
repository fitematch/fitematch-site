import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { apiClient } from '@/services/http/api-client';
import { ApiError } from '@/services/http/api-error';
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
  SignOutRequest,
  SignOutResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateMeRequest,
  UpdateMeResponse,
  ListAuthSessionsResponse,
  RevokeAuthSessionResponse,
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
    const payload: SignOutRequest = {
      refreshToken: TokenStorage.getRefreshToken(),
    };

    try {
      return await apiClient<SignOutResponse>(API_ENDPOINTS.AUTH_SIGN_OUT, {
        method: 'POST',
        auth: false,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        return {
          message: 'Sessão local encerrada.',
        };
      }

      throw error;
    } finally {
      TokenStorage.clearTokens();
    }
  },

  listSessions(): Promise<ListAuthSessionsResponse> {
    return apiClient<ListAuthSessionsResponse>(API_ENDPOINTS.AUTH_SESSIONS);
  },

  revokeSession(sessionId: string): Promise<RevokeAuthSessionResponse> {
    return apiClient<RevokeAuthSessionResponse>(
      API_ENDPOINTS.AUTH_REVOKE_SESSION(sessionId),
      {
        method: 'PATCH',
      },
    );
  },
};
