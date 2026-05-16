import { PublicCompanyResponse } from '@/services/company/company.types';

const GENERIC_BRAND_TOKENS = new Set([
  'academia',
  'academias',
  'unidade',
  'studio',
  'center',
  'fitness',
  'gym',
]);

function normalizeWords(value: string): string[] {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function buildWebsiteBrandKey(website?: string): string | null {
  if (!website) {
    return null;
  }

  try {
    const url = new URL(website);
    const hostname = url.hostname.replace(/^www\./, '');
    const [domain] = hostname.split('.');

    return domain || null;
  } catch {
    return null;
  }
}

function buildTradeNameBrandKey(tradeName: string): string | null {
  const words = normalizeWords(tradeName).filter((word) => !GENERIC_BRAND_TOKENS.has(word));

  if (words.length === 0) {
    return null;
  }

  if (words.length > 1 && words[1] === 'fit') {
    return `${words[0]}fit`;
  }

  return words[0];
}

function getCompanyBrandKey(company: PublicCompanyResponse): string | null {
  if (company.media?.logoUrl) {
    return `logo:${company.media.logoUrl}`;
  }

  const websiteBrandKey = buildWebsiteBrandKey(company.contacts?.website);
  if (websiteBrandKey) {
    return `site:${websiteBrandKey}`;
  }

  const tradeNameBrandKey = buildTradeNameBrandKey(company.tradeName);
  if (tradeNameBrandKey) {
    return `name:${tradeNameBrandKey}`;
  }

  return null;
}

function isSameCompanyBrand(
  company: PublicCompanyResponse,
  otherCompany: PublicCompanyResponse,
): boolean {
  const currentBrandKey = getCompanyBrandKey(company);
  const otherBrandKey = getCompanyBrandKey(otherCompany);

  if (!currentBrandKey || !otherBrandKey) {
    return false;
  }

  return currentBrandKey === otherBrandKey;
}

export function getUniqueCompaniesByBrand(
  companies: PublicCompanyResponse[],
): PublicCompanyResponse[] {
  return companies.filter((company, index) => {
    return !companies
      .slice(0, index)
      .some((existingCompany) => isSameCompanyBrand(company, existingCompany));
  });
}
