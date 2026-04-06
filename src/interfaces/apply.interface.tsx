export type ApplyStatus = "active" | "freeze" | "inactive" | "canceled";

export interface Apply {
  id?: string;
  companyId: string;
  jobId: string;
  userId: string;
  status: ApplyStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
