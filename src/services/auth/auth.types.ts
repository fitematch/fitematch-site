import {
  CandidateProfileEntity,
  ProductRoleEnum,
  RecruiterProfileEntity,
  UserEntity,
} from '@/types/entities/user.entity';

export type AuthUser = Omit<UserEntity, 'password'>;

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  birthday: string;
  productRole: ProductRoleEnum;
}

export interface SignUpResponse {
  id: string;
  name: string;
  email: string;
  birthday: string;
  productRole: ProductRoleEnum;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export type AuthMeResponse = AuthUser;

export interface UpdateMeRequest {
  name?: string;
  birthday?: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
}

export type UpdateMeResponse = AuthUser;

export interface RequestActivationCodeRequest {
  email: string;
}

export interface RequestActivationCodeResponse {
  message: string;
}

export interface ActivateAccountRequest {
  email: string;
  code: string;
}

export interface ActivateAccountResponse {
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignOutRequest {
  refreshToken: string | null;
}

export interface SignOutResponse {
  message?: string;
}

export interface AuthSessionResponse {
  id: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: string | Date;
  revokedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type ListAuthSessionsResponse = AuthSessionResponse[];

export type RevokeAuthSessionResponse = void;
