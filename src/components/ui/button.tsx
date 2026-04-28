import { ButtonHTMLAttributes, ReactNode } from 'react';
import { BUTTON_STYLES } from '@/constants/styles';

type Variant = 'positive' | 'danger' | 'login' | 'profile' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({
  variant = 'positive',
  icon,
  children,
  className = '',
  ...props
}: Props) {
  return (
    <button className={`${BUTTON_STYLES[variant]} ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
