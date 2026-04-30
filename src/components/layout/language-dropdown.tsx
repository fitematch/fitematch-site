'use client';

import { FaChevronDown } from 'react-icons/fa';
import { NAVIGATION_STYLES } from '@/constants/styles';

export function LanguageDropdown({ isFullWidth = false }: { isFullWidth?: boolean }) {
  return (
    <div className={isFullWidth ? 'relative w-full' : 'relative'}>
      <button className={
        isFullWidth
          ? NAVIGATION_STYLES.menuLanguageDropdown + ' w-full justify-between'
          : NAVIGATION_STYLES.menuLanguageDropdown
      }>
        <span>🇧🇷</span>
        <span>Português</span>
        <FaChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
