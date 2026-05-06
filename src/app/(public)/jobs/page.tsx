import { Metadata } from 'next';
import { JobsPageContent } from '@/components/jobs/jobs-page-content';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/constants/seo';

export const metadata: Metadata = {
  title: 'Vagas',
  description:
    'Encontre vagas para profissionais de educação física em academias, studios e empresas fitness.',
  alternates: {
    canonical: absoluteUrl('/jobs'),
  },
  openGraph: {
    title: `Vagas | ${SITE_NAME}`,
    description:
      'Encontre vagas para profissionais de educação física em academias, studios e empresas fitness.',
    url: absoluteUrl('/jobs'),
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Vagas | ${SITE_NAME}`,
    description:
      'Encontre vagas para profissionais de educação física em academias, studios e empresas fitness.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function JobsPage() {
  return <JobsPageContent />;
}
