'use client';

import Link from 'next/link';
import { FaArrowRight, FaBriefcase } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useJobs } from '@/hooks/use-jobs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card-title';

export function FeaturedJobsSection() {
  const { jobs, isLoading } = useJobs();

  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBriefcase className="text-gray-700" />
            <h2 className="text-3xl font-bold text-gray-100">
              Vagas em destaque
            </h2>
          </div>

          <Link href={ROUTES.JOBS}>
            <Button variant="login" icon={<FaArrowRight />}>
              Ver todas
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}

          {!isLoading &&
            jobs.slice(0, 3).map((job) => (
              <Card key={job._id}>
                <CardTitle>{job.title}</CardTitle>

                <p className="mt-3 text-sm text-gray-700">
                  {job.description}
                </p>

                <div className="mt-6">
                  <Link href={`${ROUTES.JOBS}/${job._id}`}>
                    <Button variant="login" icon={<FaArrowRight />}>
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
