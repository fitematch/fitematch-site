import { ReactNode } from 'react';

interface RecruiterPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function RecruiterPageHeader({
  title,
  description,
  action,
}: RecruiterPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">{title}</h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm text-gray-700">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
