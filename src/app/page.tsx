import { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { CompaniesSection } from '@/components/home/companies-section';
import { FeaturedJobsSection } from '@/components/home/featured-jobs-section';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  absoluteUrl,
} from '@/constants/seo';

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
      <HeroSection />
      <FeaturesSection />
      <CompaniesSection />
      <FeaturedJobsSection />
    </>
  );
}
