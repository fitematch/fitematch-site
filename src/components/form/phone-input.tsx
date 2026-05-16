'use client';

import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { useCountryDialCodes } from '@/hooks/use-country-dial-codes';
import { formatPhoneWithDialCode, removeDialCodeFromPhone } from '@/utils/phone.utils';

interface PhoneInputProps {
  label?: string;
  countryValue?: string;
  numberValue?: string;
  onCountryChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export function PhoneInput({
  countryValue = '+55',
  numberValue = '',
  onCountryChange,
  onNumberChange,
  error,
  disabled = false,
  className = '',
  labelClassName = 'text-gray-300',
}: PhoneInputProps) {
  const { countries, defaultCountry, isLoading } = useCountryDialCodes();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const numberInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.dialCode === countryValue) || defaultCountry;
  }, [countries, countryValue, defaultCountry]);

  const formattedPhone = formatPhoneWithDialCode(
    numberValue,
    selectedCountry.dialCode,
    selectedCountry.mask,
  );

  function handleCountryChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextDialCode = event.target.value;

    onCountryChange(nextDialCode);
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const cleanNumber = removeDialCodeFromPhone(event.target.value, selectedCountry.dialCode);

    onNumberChange(cleanNumber);
  }

  function handleCountrySelect(nextDialCode: string) {
    onCountryChange(nextDialCode);
    setIsMenuOpen(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsMenuOpen(true);
    }

    if (event.key === 'Escape') {
      setIsMenuOpen(false);
    }
  }

  function moveCaretAfterDialCode() {
    const input = numberInputRef.current;

    if (!input) {
      return;
    }

    const caretPosition = selectedCountry.dialCode.length;

    requestAnimationFrame(() => {
      input.setSelectionRange(caretPosition, caretPosition);
    });
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>País</label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              onKeyDown={handleTriggerKeyDown}
              disabled={disabled || isLoading}
              aria-haspopup="listbox"
              aria-expanded={isMenuOpen}
              className="inline-flex h-[50px] w-full items-center justify-between gap-x-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-sm font-semibold text-zinc-100 outline-none transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="min-w-0 truncate">
                {selectedCountry.flag} {selectedCountry.name} {selectedCountry.dialCode}
              </span>
              <FiChevronDown className="size-5 shrink-0 text-zinc-400" />
            </button>

            {isMenuOpen && !(disabled || isLoading) ? (
              <div
                role="listbox"
                aria-label="Código do País"
                className="absolute left-0 z-20 mt-2 max-h-80 w-full origin-top-right overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/95 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition [scrollbar-color:theme(colors.lime.500)_theme(colors.zinc.950)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-zinc-950 [&::-webkit-scrollbar-thumb:hover]:bg-lime-500/70"
              >
                {countries.map((country) => {
                  const isSelected = country.dialCode === selectedCountry.dialCode;

                  return (
                    <button
                      key={`${country.isoCode}-${country.dialCode}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCountrySelect(country.dialCode)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm outline-none transition-all duration-200 ${
                        isSelected
                          ? 'bg-lime-500/10 text-lime-300'
                          : 'text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-100 focus:bg-white/[0.04] focus:text-zinc-100'
                      }`}
                    >
                      <span className="min-w-0 truncate">
                        {country.flag} {country.name} {country.dialCode}
                      </span>
                      {isSelected ? <FiCheck className="size-4 shrink-0 text-lime-300" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <select
              value={selectedCountry.dialCode}
              onChange={handleCountryChange}
              disabled={disabled || isLoading}
              tabIndex={-1}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0"
            >
              {countries.map((country) => (
                <option key={`${country.isoCode}-${country.dialCode}`} value={country.dialCode}>
                  {country.flag} {country.name} {country.dialCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>Número</label>
          <input
            ref={numberInputRef}
            value={formattedPhone}
            onChange={handleNumberChange}
            onFocus={moveCaretAfterDialCode}
            onClick={moveCaretAfterDialCode}
            disabled={disabled}
            placeholder={`${selectedCountry.dialCode} ${selectedCountry.mask}`}
            className="h-[50px] w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-100">{error}</p>}
    </div>
  );
}
