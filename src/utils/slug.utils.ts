function normalizeSlugPart(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function buildJobSlug(parts: Array<string | undefined | null>) {
  return parts
    .map((part) => normalizeSlugPart(part || ''))
    .filter(Boolean)
    .join('-');
}
