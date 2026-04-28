import { FaBuilding } from 'react-icons/fa';

import { SectionTitle } from '@/components/ui/section-title';
import { THEME } from '@/constants/theme';

const companies = [
  'Bluefit',
  'Panobianco',
  'Smart Fit',
  'Bio Ritmo',
  'Competition',
  'Bodytech',
];

export function CompaniesSection() {
  return (
    <section className={`${THEME.layout.background} py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <FaBuilding className={`h-6 w-6 ${THEME.icon.default}`} />
          <SectionTitle
            title="Empresas que usam a plataforma"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company}
              className={`flex h-24 items-center justify-center rounded-xl border ${THEME.layout.border} ${THEME.layout.background} px-4 text-center`}
            >
              <span className={`text-sm font-semibold ${THEME.text.body}`}>
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
