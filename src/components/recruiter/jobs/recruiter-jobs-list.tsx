'use client';

import Link from 'next/link';
import { FaEdit, FaUsers } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useRecruiterJobs } from '@/hooks/use-recruiter-jobs';

export function RecruiterJobsList() {
  const { jobs, isLoading, error } = useRecruiterJobs();

  if (isLoading) {
    return <p className="text-gray-700">Carregando vagas...</p>;
  }

  if (error) {
    return <p className="text-red-100">{error}</p>;
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-900 p-6 text-gray-700">
        Você ainda não publicou nenhuma vaga.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <article
          key={job._id}
          className="rounded-2xl border border-gray-900 bg-black p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">
                {job.title}
              </h2>

              <p className="mt-2 text-sm text-gray-700">
                {job.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                <span>Status: {job.status}</span>
                <span>Tipo: {job.contractType}</span>
                <span>Vagas: {job.slots}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={ROUTES.RECRUITER_EDIT_JOB(job._id)}>
                <Button variant="profile" icon={<FaEdit />}>
                  Editar
                </Button>
              </Link>

              <Link href={ROUTES.RECRUITER_JOB_APPLICATIONS(job._id)}>
                <Button variant="login" icon={<FaUsers />}>
                  Candidatos
                </Button>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
