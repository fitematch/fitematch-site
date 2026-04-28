import { ButtonHTMLAttributes, ReactNode } from 'react';
import { BUTTON_STYLES, BUTTON_VARIANT_ALIASES } from '@/constants/styles';

type ButtonColor = keyof typeof BUTTON_STYLES;
type Variant = keyof typeof BUTTON_VARIANT_ALIASES;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({
  color,
  variant = 'positive',
  icon,
  children,
  className = '',
  ...props
}: Props) {
  const resolvedColor = color || BUTTON_VARIANT_ALIASES[variant];

  return (
    <button className={`${BUTTON_STYLES[resolvedColor]} ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
