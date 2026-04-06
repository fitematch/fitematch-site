'use server';

import axios from 'axios';

import { Apply } from '@/interfaces/apply.interface';
import { CreateJobApplyRequestInterface } from '@/interfaces/request/create-apply-request.interface';
import { ReadJobResponseInterface } from '@/interfaces/responses/read-job-response.interface';

const APPLY_API_URL = 'http://localhost:3002/apply';

/**
 * List all applies with API.
 */
export async function getApplies(): Promise<Apply[]> {
  const { data } = await axios.get<Apply[]>(
    APPLY_API_URL,
  );

  return data;
}

export const getAllApplies = getApplies;

/**
 * Create a new job apply with API.
 */
export async function createNewJobApply(
  data: CreateJobApplyRequestInterface,
): Promise<Apply> {
  const payload: CreateJobApplyRequestInterface = {
    ...data,
  };
  try {
    const response = await axios.post<Apply>(APPLY_API_URL, payload);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data === 'object' &&
        error.response?.data &&
        'message' in error.response.data
          ? String(error.response.data.message)
          : error.message;

      throw new Error(apiMessage);
    }

    throw error;
  }
}


/**
 * Get apply from API.
 */
export async function getJob(jobId: string): Promise<ReadJobResponseInterface> {
  const { data } = await axios.get<ReadJobResponseInterface>(`${APPLY_API_URL}/${jobId}`);

  return data;
}
