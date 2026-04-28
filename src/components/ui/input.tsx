import { InputHTMLAttributes, ReactNode } from 'react';
import { INPUT_STYLES } from '@/constants/styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
}

export function Input({ icon, error, className = '', ...props }: Props) {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700">
            {icon}
          </div>
        )}

        <input
          className={`${INPUT_STYLES} ${icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-100">{error}</p>
      )}
    </div>
  );
}