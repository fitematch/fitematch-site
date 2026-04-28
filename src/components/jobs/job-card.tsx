import Link from 'next/link';
import { FaArrowRight, FaBriefcase } from 'react-icons/fa';
import { JobEntity } from '@/types/entities/job.entity';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card-title';
import { THEME } from '@/constants/theme';

interface JobCardProps {
  job: JobEntity;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <article className={`rounded-xl border ${THEME.layout.border} ${THEME.layout.background} p-6`}>
      <div className={`flex items-center gap-3 ${THEME.text.body}`}>
        <FaBriefcase />
        <span className="text-sm uppercase">
          {job.status}
        </span>
      </div>
      <div className="mt-4">
        <CardTitle>{job.title}</CardTitle>
      </div>
      <p className={`mt-3 line-clamp-3 text-sm ${THEME.text.body}`}>
        {job.description}
      </p>
      <div className="mt-6">
        <Link href={`/jobs/${job._id}`}>
          <Button variant="login" icon={<FaArrowRight />}>
            Ver detalhes
          </Button>
        </Link>
      </div>
    </article>
  );
}
