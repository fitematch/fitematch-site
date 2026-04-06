import { ApplyStatus } from "@/interfaces/apply.interface";

export interface CreateJobApplyRequestInterface {
  companyId: string;
  jobId: string;
  userId: string;
  status: ApplyStatus;
}
