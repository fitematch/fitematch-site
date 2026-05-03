'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { JobSearchInput } from '@/components/jobs/job-search-input';
import { THEME } from '@/constants/theme';
import { TEXT_STYLES } from '@/constants/styles';
import { JobGrid } from '@/components/jobs/job-grid';

export default function JobsPage() {
  const [search, setSearch] = useState('');

  return (
    <section className={`min-h-screen ${THEME.layout.background} py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Vagas' },
          ]}
        />

        <h1 className={`${TEXT_STYLES.pageTitle} mt-8`}>
          Vagas
        </h1>

        <p className={TEXT_STYLES.pageSubtitle}>
          Encontre sua próxima oportunidade de carreira.
        </p>

        {/* Busca */}
        <div className="mt-8">
          <JobSearchInput value={search} onChange={setSearch} />
        </div>

        {/* Grid */}
        <div className="mt-10">
          <JobGrid search={search} />
        </div>
      </div>
    </section>
  );
}
