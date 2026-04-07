import { Company } from "@/interfaces/company.interface";
import { JobBenefits } from "@/interfaces/job-benefits.interface";

export interface Job {
  id?: string;
  companyId: string;
  slug: string;
  title: string;
  cover?: string | null;
  slots: number;
  benefits: JobBenefits;
  isPaidAdvertising?: boolean;
  role: "intern" | "freelance" | "contract_person" | "contract_company";
  status: string;
  company: Company;
  createdAt?: Date;
  updatedAt?: Date;
}
