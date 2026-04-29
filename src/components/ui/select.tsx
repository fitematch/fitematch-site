import { SelectHTMLAttributes, ReactNode } from 'react';

interface Option {
  value: string | number;
  label: ReactNode;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  error?: string;
}

export function Select({ options, label, error, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={`w-full rounded-md border px-4 py-3 bg-black text-gray-100 ${className}`}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-100">{error}</p>}
    </div>
  );
}
