'use client';

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { useCountryDialCodes } from '@/hooks/use-country-dial-codes';
import {
  formatPhoneWithDialCode,
  removeDialCodeFromPhone,
} from '@/utils/phone.utils';

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

  const selectedCountry = useMemo(() => {
    return (
      countries.find((country) => country.dialCode === countryValue) ||
      defaultCountry
    );
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
    const cleanNumber = removeDialCodeFromPhone(
      event.target.value,
      selectedCountry.dialCode,
    );

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

  return (
    <div className={`w-full ${className}`}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
            Código do País
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              onKeyDown={handleTriggerKeyDown}
              disabled={disabled || isLoading}
              aria-haspopup="listbox"
              aria-expanded={isMenuOpen}
              className="inline-flex h-[50px] w-full items-center justify-between gap-x-2 rounded-xl border border-gray-500 bg-black px-4 py-3 text-left text-sm font-semibold text-gray-100 outline-none transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="min-w-0 truncate">
                {selectedCountry.flag} {selectedCountry.name} {selectedCountry.dialCode}
              </span>
              <FiChevronDown className="size-5 shrink-0 text-gray-400" />
            </button>

            {isMenuOpen && !(disabled || isLoading) ? (
              <div
                role="listbox"
                aria-label="Código do País"
                className="absolute left-0 z-20 mt-2 max-h-80 w-full origin-top-right overflow-y-auto divide-y divide-white/10 rounded-xl bg-gray-900 outline-1 -outline-offset-1 outline-white/10 transition [--anchor-gap:--spacing(2)] [scrollbar-color:theme(colors.gray.500)_theme(colors.gray.950)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-gray-900"
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
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-gray-300 outline-none transition hover:bg-white/5 focus:bg-white/5 focus:text-white"
                    >
                      <span className="min-w-0 truncate">
                        {country.flag} {country.name} {country.dialCode}
                      </span>
                      {isSelected ? (
                        <FiCheck className="size-4 shrink-0 text-white" />
                      ) : null}
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
                <option
                  key={`${country.isoCode}-${country.dialCode}`}
                  value={country.dialCode}
                >
                  {country.flag} {country.name} {country.dialCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
            Número de Telefone
          </label>
          <input
            value={formattedPhone}
            onChange={handleNumberChange}
            disabled={disabled}
            placeholder={`${selectedCountry.dialCode} ${selectedCountry.mask}`}
            className="h-[50px] w-full rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-100 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-100">{error}</p>}
    </div>
  );
}
