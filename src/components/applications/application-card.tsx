import Link from 'next/link';
import { FaArrowRight, FaClipboardCheck } from 'react-icons/fa';
import ApplyEntity from '@/types/entities/apply.entity';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

interface ApplicationCardProps {
  application: ApplyEntity;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <article className="rounded-xl border border-gray-900 p-6">
      <div className="flex items-center gap-3 text-gray-700">
        <FaClipboardCheck />
        <span className="text-sm uppercase">{application.status}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-gray-100">
        Aplicação #{application._id}
      </h3>

      <p className="mt-2 text-sm text-gray-700">
        Job ID: {application.jobId}
      </p>

      <div className="mt-6">
        <Link href={`${ROUTES.APPLICATIONS}/${application._id}`}>
          <Button variant="login" icon={<FaArrowRight />}>
            Ver aplicação
          </Button>
        </Link>
      </div>
    </article>
  );
}
