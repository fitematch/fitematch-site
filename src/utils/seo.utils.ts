import { absoluteUrl } from '@/constants/seo';

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncateMetaDescription(value: string, max = 160): string {
  const normalized = value.trim();

  if (normalized.length <= max) {
    return normalized;
  }

  const truncated = normalized.slice(0, max - 1);
  const safeBoundary = truncated.lastIndexOf(' ');

  return `${(safeBoundary > 0 ? truncated.slice(0, safeBoundary) : truncated).trim()}…`;
}

export function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeUndefinedDeep(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [key, removeUndefinedDeep(nestedValue)])
        .filter(([, nestedValue]) => nestedValue !== undefined)
    ) as T;
  }

  return value;
}

export function toAbsoluteUrl(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  return absoluteUrl(path);
}
