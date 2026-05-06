export function resolveFileUrl(url?: string) {
  if (!url) {
    return '';
  }

  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) {
    return url;
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return url;
  }

  return `${apiBaseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
}
