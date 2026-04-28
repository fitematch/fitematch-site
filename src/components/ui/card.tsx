import { ReactNode } from 'react';
import { CARD_STYLES } from '@/constants/styles';

export function Card({ children }: { children: ReactNode }) {
  return <div className={CARD_STYLES.base}>{children}</div>;
}
