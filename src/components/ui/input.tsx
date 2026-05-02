'use client';

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { FaEyeSlash, FaRegEye } from 'react-icons/fa';
import { INPUT_STYLES } from '@/constants/styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  labelClassName?: string;
  error?: string;
}

export function Input({
  icon,
  label,
  labelClassName = 'text-gray-300',
  error,
  className = '',
  ...props
}: Props) {
  const isPasswordField = props.type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPasswordField && isPasswordVisible ? 'text' : props.type;

  return (
    <div className="w-full">
      {label && (
        <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700">
            {icon}
          </div>
        )}

        <input
          className={`${INPUT_STYLES} ${icon ? 'pl-11' : ''} ${isPasswordField ? 'pr-11' : ''} ${className}`}
          {...props}
          type={inputType}
        />

        {isPasswordField && (
          <button
            type="button"
            aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setIsPasswordVisible((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 transition hover:text-gray-500"
          >
            {isPasswordVisible ? <FaRegEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-100">{error}</p>
      )}
    </div>
  );
}
