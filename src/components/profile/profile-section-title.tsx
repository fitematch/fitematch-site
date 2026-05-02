'use client';

import { type IconType } from 'react-icons';
import { TiDocumentText } from 'react-icons/ti';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { TEXT_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';

type ProfileSectionTitleProps = {
  title: string;
  onIconClick?: () => void;
  iconClickable?: boolean;
  expanded?: boolean;
  containerClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
  toggleIconClassName?: string;
  icon?: IconType;
};

export function ProfileSectionTitle({
  title,
  onIconClick,
  iconClickable = false,
  expanded,
  containerClassName = '',
  titleClassName = '',
  iconClassName = '',
  toggleIconClassName = '',
  icon: Icon = TiDocumentText,
}: ProfileSectionTitleProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${THEME.sectionProfile.profileCardTitle} ${containerClassName}`}>
      <div className={`flex items-center gap-3 ${TEXT_STYLES.card.profile.title} ${titleClassName}`}>
        <Icon className={`h-6 w-6 ${iconClassName}`} />
        <h2>{title}</h2>
      </div>
      {iconClickable ? (
        <button
          type="button"
          onClick={onIconClick}
          aria-label={expanded ? 'Esconder conteúdo' : 'Mostrar conteúdo'}
          className="focus:outline-none"
        >
          <MdKeyboardDoubleArrowDown
            className={`h-6 w-6 transition-transform duration-200 ${THEME.icon.default} ${toggleIconClassName} ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      ) : (
        <MdKeyboardDoubleArrowDown className={`h-6 w-6 ${THEME.icon.default} ${toggleIconClassName}`} />
      )}
    </div>
  );
}
