import { ReactNode } from 'react';
import { TEXT_STYLES } from '@/constants/styles';

export function SectionTitle({
  title,
  icon,
}: {
  title: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <span className={`flex items-center ${TEXT_STYLES.sectionIcon}`}>
          {icon}
        </span>
      )}
      <h2 className={`${TEXT_STYLES.sectionTitle} mt-0 leading-none`}>
        {title}
      </h2>
    </div>
  );
}
