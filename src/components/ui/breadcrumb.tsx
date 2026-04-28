import Link from 'next/link';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { THEME } from '@/constants/theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${THEME.text.body}`}>
      <FaHome className={THEME.navigation.breadcrumbIcon} />

      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 && (
            <FaChevronRight
              className={`h-3 w-3 ${THEME.navigation.breadcrumbIcon}`}
            />
          )}

          {item.href ? (
            <Link href={item.href} className={THEME.navigation.breadcrumb}>
              {item.label}
            </Link>
          ) : (
            <span className={THEME.navigation.breadcrumbActive}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
