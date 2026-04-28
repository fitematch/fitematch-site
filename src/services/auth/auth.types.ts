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
  acceptedTermsOfUse: boolean;
  acceptedPrivacyPolicy: boolean;
}

export interface SignUpResponse {
  user: AuthUser;
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

export interface SignOutResponse {
  message?: string;
}