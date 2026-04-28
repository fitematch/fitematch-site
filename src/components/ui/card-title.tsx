import { TEXT_STYLES } from '@/constants/styles';

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className={TEXT_STYLES.cardTitle}>{children}</h3>;
}