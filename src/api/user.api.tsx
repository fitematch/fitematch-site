'use server';

import axios from 'axios';

import { User } from '@/interfaces/user.interface';
import { CreateUserRequestInterface } from '@/interfaces/create-user-request.interface';
import { ListUsersResponseInterface } from '@/interfaces/list-user-request.interface';
import { UpdateUserRequestInterface } from '@/interfaces/update-user-request.interface';

const USER_API_URL = 'http://localhost:3001/user';

type UserMutationPayload = {
  birthday: string;
  documents: {
    identityDocument?: string;
    socialDocument?: string;
  };
  firstName: string;
  lastName: string;
  details: {
    city?: string;
    complement?: string;
    isTelegram?: boolean;
    isWhatsApp?: boolean;
    neighborhood?: string;
    number?: string | number;
    phone?: string;
    state?: string;
    street?: string;
    zipCode?: string;
  };
  email: string;
  password: string;
  role: string;
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
  };
  status: string;
  username: string;
};

type UserApiResponse = User & {
  details?: {
    city?: string;
    complement?: string;
    isTelegram?: boolean;
    isWhatsApp?: boolean;
    neighborhood?: string;
    number?: string | number;
    phone?: string;
    state?: string;
    street?: string;
    zipCode?: string;
    zipcode?: string;
  };
  documents?: {
    identityDocument?: string;
    socialDocument?: string;
  };
};

function buildUserMutationPayload(data: UpdateUserRequestInterface | CreateUserRequestInterface): UserMutationPayload {
  return {
    birthday: data.birthday,
    documents: {
      identityDocument: data.identityDocument,
      socialDocument: data.socialDocument,
    },
    firstName: data.firstName,
    lastName: data.lastName,
    details: {
      city: data.city,
      complement: data.complement,
      isTelegram: data.isTelegram,
      isWhatsApp: data.isWhatsApp,
      neighborhood: data.neighborhood,
      number: data.number,
      phone: data.phone,
      state: data.state,
      street: data.street,
      zipCode: data.zipCode,
    },
    email: data.email,
    password: data.password,
    role: data.role,
    social: {
      facebook: data.social?.facebook,
      instagram: data.social?.instagram,
      linkedin: data.social?.linkedin,
      x: data.social?.x ?? data.social?.twitter,
    },
    status: data.status,
    username: data.username,
  };
}

function normalizeUserResponse(data: UserApiResponse): User {
  return {
    ...data,
    city: data.city ?? data.details?.city,
    complement: data.complement ?? data.details?.complement,
    identityDocument: data.identityDocument ?? data.documents?.identityDocument,
    isTelegram: data.isTelegram ?? data.details?.isTelegram,
    isWhatsApp: data.isWhatsApp ?? data.details?.isWhatsApp,
    neighborhood: data.neighborhood ?? data.details?.neighborhood,
    number: data.number ?? data.details?.number,
    phone: data.phone ?? data.details?.phone,
    socialDocument: data.socialDocument ?? data.documents?.socialDocument,
    state: data.state ?? data.details?.state,
    street: data.street ?? data.details?.street,
    zipCode: data.zipCode ?? data.details?.zipCode ?? data.details?.zipcode,
  };
}

/**
 * List all users with API.
 */
export async function getAllUsers(): Promise<ListUsersResponseInterface> {
  const { data } = await axios.get<ListUsersResponseInterface>(
    USER_API_URL,
  );

  return data;
}

/**
 * Create a new user with API.
 */
export async function createUser(
  data: CreateUserRequestInterface,
): Promise<User> {
  const payload = buildUserMutationPayload(data);

  const response = await axios.post<UserApiResponse>(`${USER_API_URL}/`, payload);

  return normalizeUserResponse(response.data);
}

/**
 * Get user from API.
 */
export async function getUser(userId: string): Promise<User> {
  const { data } = await axios.get<UserApiResponse>(`${USER_API_URL}/${userId}`);

  return normalizeUserResponse(data);
}

/**
 * Update user with API.
 */
export async function updateUser(
  userId: string,
  data: UpdateUserRequestInterface,
): Promise<User> {
  const payload = buildUserMutationPayload(data);

  const response = await axios.patch<UserApiResponse>(
    `${USER_API_URL}/${userId}`,
    payload,
  );

  return normalizeUserResponse(response.data);
}

/**
 * Delete user with API.
 */
export async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`${USER_API_URL}/${userId}`);
}
