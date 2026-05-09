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
  labelClassName = 'text-zinc-300',
  error,
  leftIcon: LeftIcon,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>{label}</label>
      )}
      <div className="relative">
        {LeftIcon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 rounded-xl border border-zinc-800 bg-black/40 p-2 text-lime-400">
            <LeftIcon className="h-4 w-4" />
          </span>
        )}
        <select
          className={`h-[50px] w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 py-3 pr-12 text-zinc-100 outline-none transition-all duration-300 hover:border-zinc-700 focus:border-lime-500/20 ${LeftIcon ? 'pl-14' : 'px-4'} ${className}`}
          {...props}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-zinc-400">
          <MdKeyboardDoubleArrowDown className="h-5 w-5" />
        </span>
      </div>
      {error && <p className="mt-2 text-sm text-red-100">{error}</p>}
    </div>
  );
}
