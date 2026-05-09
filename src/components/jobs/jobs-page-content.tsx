'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { JobSearchInput } from '@/components/jobs/job-search-input';
import { JobGrid } from '@/components/jobs/job-grid';
import { PAGE_STYLES } from '@/constants/styles';

export function JobsPageContent() {
  const [search, setSearch] = useState('');

  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Vagas' }]} />

        <div className="mt-8">
          <JobSearchInput value={search} onChange={setSearch} />
        </div>

        <div className="mt-12">
          <JobGrid search={search} />
        </div>
      </div>
    </section>
  );
}
