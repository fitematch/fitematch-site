import { existsSync } from 'fs';
import path from 'path';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/constants/seo';
import { removeUndefinedDeep } from '@/utils/seo.utils';

function getOrganizationLogoUrl() {
  const preferredLogo = path.join(process.cwd(), 'public/images/logo/fitematch.svg');
  const fallbackLogo = path.join(process.cwd(), 'public/images/logo/logo.png');

  if (existsSync(preferredLogo)) {
    return absoluteUrl('/images/logo/fitematch.svg');
  }

  if (existsSync(fallbackLogo)) {
    return absoluteUrl('/images/logo/logo.png');
  }

  return undefined;
}

export function OrganizationJsonLd() {
  const payload = removeUndefinedDeep({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: getOrganizationLogoUrl(),
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
