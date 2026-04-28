import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { CompaniesSection } from '@/components/home/companies-section';
import { FeaturedJobsSection } from '@/components/home/featured-jobs-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CompaniesSection />
      <FeaturedJobsSection />
    </>
  );
}