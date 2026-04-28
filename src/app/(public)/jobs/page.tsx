import { Breadcrumb } from '@/components/ui/breadcrumb';
import { JobSearchInput } from '@/components/jobs/job-search-input';

import { THEME } from '@/constants/theme';
import { JobGrid } from '@/components/jobs/job-grid';

export default function JobsPage() {
  return (
    <section className={`min-h-screen ${THEME.layout.background} py-12`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Vagas' },
          ]}
        />

        <div className="mt-8">
          <JobSearchInput />
        </div>

        <div className="mt-10">
          <JobGrid />
        </div>
      </div>
    </section>
  );
}
