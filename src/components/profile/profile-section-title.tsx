'use client';

import { TiDocumentText } from 'react-icons/ti';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { TEXT_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';

export function ProfileSectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <TiDocumentText className={`h-6 w-6 ${THEME.icon.default}`} />
        <h2 className={TEXT_STYLES.featureTitle}>{title}</h2>
      </div>

      <MdKeyboardDoubleArrowDown className={`h-6 w-6 ${THEME.icon.default}`} />
    </div>
  );
}
