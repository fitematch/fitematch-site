import ApplyEntity, {
  ApplicationStatusEnum,
} from '@/types/entities/apply.entity';

export interface CreateApplyRequest {
  jobId: string;
}

export type CreateApplyResponse = ApplyEntity;

export type ReadApplyResponse = ApplyEntity;

export type ListMyAppliesResponse = ApplyEntity[];

export type ListAppliesByJobResponse = ApplyEntity[];

export interface UpdateApplyStatusRequest {
  status: ApplicationStatusEnum;
}

export type UpdateApplyStatusResponse = ApplyEntity;

export type DeleteApplyResponse = void;
