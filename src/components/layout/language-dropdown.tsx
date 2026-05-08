'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { NAVIGATION_STYLES } from '@/constants/styles';

const LANGUAGES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'es', label: 'Espanhol', flag: '🇪🇸' },
  { code: 'en', label: 'Inglês', flag: '🇺🇸' },
];

export function LanguageDropdown({ isFullWidth = false }: { isFullWidth?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={isFullWidth ? 'relative w-full' : 'relative'}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={
          isFullWidth
            ? `${NAVIGATION_STYLES.menuLanguageDropdown} w-full justify-between`
            : NAVIGATION_STYLES.menuLanguageDropdown
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span>{selectedLanguage.flag}</span>
          <span>{selectedLanguage.label}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Selecionar idioma"
          className="absolute right-0 z-30 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          {LANGUAGES.map((language) => {
            const isSelected = language.code === selectedLanguage.code;

            return (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedLanguage(language);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-lime-500/10 text-lime-300'
                    : 'text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{language.flag}</span>
                  <span>{language.label}</span>
                </span>
                {isSelected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
