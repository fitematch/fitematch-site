'use client';

import { useParams } from 'next/navigation';
import { useJob } from '@/hooks/use-job';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { ApplyJobButton } from '@/components/jobs/apply-job-button';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const { job, isLoading, error } = useJob(jobId);

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!job) {
    return null;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold text-gray-100">
        {job.title}
      </h1>

      <p className="mt-6 text-gray-700">{job.description}</p>

      <div className="mt-10">
        <ApplyJobButton jobId={job._id} />
      </div>
    </section>
  );
}
