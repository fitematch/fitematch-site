import { ReactNode } from 'react';
import { TEXT_STYLES } from '@/constants/styles';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface RecruiterPageHeaderBreadcrumbItem {
  label: string;
  href?: string;
}

interface RecruiterPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: RecruiterPageHeaderBreadcrumbItem[];
}

export function RecruiterPageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: RecruiterPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} />
        )}

        <h1 className={TEXT_STYLES.pageTitle}>{title}</h1>

        {description && (
          <p className={`${TEXT_STYLES.pageSubtitle} max-w-2xl`}>
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
