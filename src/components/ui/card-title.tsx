import { TEXT_STYLES } from '@/constants/styles';

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`${TEXT_STYLES.featureTitle} ${className}`}>{children}</h3>;
}
