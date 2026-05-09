'use client';

import { ChevronDown, FileText } from 'lucide-react';
import { type IconType } from 'react-icons';
import { TiDocumentText } from 'react-icons/ti';

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
    <div className={`flex items-center justify-between gap-4 ${containerClassName}`}>
      <div
        className={`flex items-center gap-3 text-xl font-semibold text-zinc-100 ${titleClassName}`}
      >
        {Icon === TiDocumentText ? (
          <FileText className={`h-5 w-5 text-lime-400 ${iconClassName}`} />
        ) : (
          <Icon className={`h-6 w-6 ${iconClassName}`} />
        )}
        <h2>{title}</h2>
      </div>
      {iconClickable ? (
        <button
          type="button"
          onClick={onIconClick}
          aria-label={expanded ? 'Esconder conteúdo' : 'Mostrar conteúdo'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-black/40 text-zinc-400 transition-all duration-300 hover:border-lime-500/20 hover:text-zinc-100 focus:outline-none"
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${toggleIconClassName} ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      ) : (
        <ChevronDown className={`h-5 w-5 text-zinc-500 ${toggleIconClassName}`} />
      )}
    </div>
  );
}
