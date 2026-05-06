import { removeUndefinedDeep } from '@/utils/seo.utils';
import { absoluteUrl } from '@/constants/seo';
import { resolveFileUrl } from '@/utils/file-url';

interface JobPostingJsonLdJob {
  title: string;
  description: string;
  createdAt?: string | Date;
  contractType?: string;
  company?: {
    tradeName?: string;
    contacts?: {
      website?: string;
      address?: {
        street?: string;
        number?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
    };
    media?: {
      logoUrl?: string;
    };
  };
}

interface JobPostingJsonLdProps {
  job: JobPostingJsonLdJob;
}

function mapEmploymentType(contractType?: string) {
  const normalized = contractType?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (normalized === 'full_time' || normalized === 'clt') {
    return 'FULL_TIME';
  }

  if (normalized === 'part_time') {
    return 'PART_TIME';
  }

  if (normalized === 'temporary') {
    return 'TEMPORARY';
  }

  if (normalized === 'internship') {
    return 'INTERN';
  }

  if (
    normalized === 'freelance' ||
    normalized === 'pj' ||
    normalized === 'autonomous'
  ) {
    return 'CONTRACTOR';
  }

  return undefined;
}

export function JobPostingJsonLd({ job }: JobPostingJsonLdProps) {
  const company = job.company;
  const address = company?.contacts?.address;
  const streetAddress = [address?.street, address?.number].filter(Boolean).join(', ');
  const logoUrl = company?.media?.logoUrl
    ? resolveFileUrl(company.media.logoUrl)
    : undefined;

  const payload = removeUndefinedDeep({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    employmentType: mapEmploymentType(job.contractType),
    hiringOrganization: {
      '@type': 'Organization',
      name: company?.tradeName || 'fitematch',
      sameAs: company?.contacts?.website,
      logo: logoUrl ? absoluteUrl(logoUrl) : undefined,
    },
    jobLocation:
      address && Object.values(address).some(Boolean)
        ? {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              streetAddress: streetAddress || undefined,
              addressLocality: address.city,
              addressRegion: address.state,
              postalCode: address.zipCode,
              addressCountry: address.country || 'BR',
            },
          }
        : undefined,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
