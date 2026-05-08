import { Metadata } from 'next';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TITLE, absoluteUrl } from '@/constants/seo';
import { HomeFeatures } from '@/features/home/components/features';
import { FeaturedJobs } from '@/features/home/components/featured-jobs';
import { HomeHero } from '@/features/home/components/hero';
import { PartnerCompanies } from '@/features/home/components/partner-companies';

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl('/'),
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <HomeHero />
      <HomeFeatures />
      <PartnerCompanies />
      <FeaturedJobs />
    </>
  );
}
