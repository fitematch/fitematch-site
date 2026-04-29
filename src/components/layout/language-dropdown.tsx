'use client';

import { FaChevronDown } from 'react-icons/fa';
import { NAVIGATION_STYLES } from '@/constants/styles';

export function LanguageDropdown() {
  return (
    <div className="relative">
      <button className={NAVIGATION_STYLES.menuLanguageDropdown}>
        <span>🇧🇷</span>
        <span>Português</span>
        <FaChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
