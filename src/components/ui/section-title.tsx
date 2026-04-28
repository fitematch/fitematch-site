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
      {icon && <span className="text-gray-700">{icon}</span>}
      <h2 className={TEXT_STYLES.sectionTitle}>{title}</h2>
    </div>
  );
}