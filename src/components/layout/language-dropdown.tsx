'use client';

import { FaChevronDown } from 'react-icons/fa';
import { THEME } from '@/constants/theme';

export function LanguageDropdown() {
  return (
    <div className="relative">
      <button className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${THEME.text.menu}`}>
        <span>🇧🇷</span>
        <span>Português</span>
        <FaChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}