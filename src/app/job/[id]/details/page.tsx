import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllApplies } from "@/api/apply.api";
import { getJob } from "@/api/job.api";
import Breadcrumb from "@/components/Common/Breadcrumb";
import JobDetailsPageClient from "@/components/Jobs/JobDetailsPageClient";
import { Job } from "@/interfaces/job.interface";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function readJobOrNull(jobId: string): Promise<Job | null> {
  try {
    return await getJob(jobId);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await readJobOrNull(id);

  if (!job) {
    return {
      title: "fitematch | Vaga não encontrada",
    };
  }

  const locationLabel = [
    job.company.address?.city?.trim(),
    job.company.address?.state?.trim(),
  ]
    .filter(Boolean)
    .join(" - ");

  return {
    title: `fitematch | ${job.title}`,
    description:
      locationLabel ||
      "Confira os detalhes da vaga e avance para a candidatura.",
  };
}

export default async function JobDetailsPage({
  params,
}: Readonly<JobDetailsPageProps>) {
  const { id } = await params;
  const [job, applies] = await Promise.all([
    readJobOrNull(id),
    getAllApplies(),
  ]);

  if (!job) {
    notFound();
  }
  const hasApplied = applies.some((apply) => apply.jobId === job.id);
  const locationLabel = [
    job.company.address?.city?.trim(),
    job.company.address?.state?.trim(),
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <>
      <Breadcrumb
        pageName={job.title}
        description={locationLabel || "Localização não informada"}
      />
      <JobDetailsPageClient job={job} hasApplied={hasApplied} />
    </>
  );
}
