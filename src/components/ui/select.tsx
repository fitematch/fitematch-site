import { SelectHTMLAttributes, ReactNode } from 'react';
import { type IconType } from 'react-icons';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';

interface Option {
  value: string | number;
  label: ReactNode;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  labelClassName?: string;
  error?: string;
  leftIcon?: IconType;
}

export function Select({
  options,
  label,
  labelClassName = 'text-gray-300',
  error,
  leftIcon: LeftIcon,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 rounded-md bg-gray-100 p-2 text-black">
            <LeftIcon className="h-4 w-4" />
          </span>
        )}
        <select
          className={`h-[50px] w-full appearance-none rounded-md border bg-black py-3 pr-12 text-gray-100 ${LeftIcon ? 'pl-14' : 'px-4'} ${className}`}
          {...props}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-300">
          <MdKeyboardDoubleArrowDown className="h-5 w-5" />
        </span>
      </div>
      {error && <p className="mt-2 text-sm text-red-100">{error}</p>}
    </div>
  );
}
