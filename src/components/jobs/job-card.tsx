import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { JobEntity } from '@/types/entities/job.entity';
import { PublicCompanyResponse } from '@/services/company/company.types';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card-title';
import { CARD_STYLES, TEXT_STYLES } from '@/constants/styles';
import { JobCompanyHeader } from './job-company-header';

interface JobCardProps {
  job: JobEntity;
  company?: PublicCompanyResponse;
}

export function JobCard({ job, company }: JobCardProps) {
  const location = [
    company?.contacts?.address?.city,
    company?.contacts?.address?.state,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <article className={CARD_STYLES.jobBox}>
      <JobCompanyHeader job={job} company={company} />

      <div className="mt-4">
        <CardTitle className={TEXT_STYLES.jobCardTitle}>
          {location ? `${job.title} - ${location}` : job.title}
        </CardTitle>
      </div>
      <p className={`mt-3 line-clamp-3 ${TEXT_STYLES.jobCardText}`}>
        {job.slots === 1 ? '1 vaga disponível' : `${job.slots} vagas disponíveis`}
      </p>
      <div className="mt-6 flex justify-end">
        <Link href={`/jobs/${job._id}`}>
          <Button variant="login" icon={<FaArrowRight />}>
            Ver detalhes
          </Button>
        </Link>
      </div>
    </article>
  );
}
