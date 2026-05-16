function normalizePublicAssetPath(pathname: string) {
  if (pathname.startsWith('/public/images/')) {
    return pathname.replace('/public/images/', '/images/');
  }

  return pathname;
}

export function resolveFileUrl(url?: string) {
  if (!url) {
    return '';
  }

  if (url.startsWith('blob:')) {
    return url;
  }

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsedUrl = new URL(url);
      const normalizedPath = normalizePublicAssetPath(parsedUrl.pathname);
      const isFirstPartyPublicAsset =
        ['/images/', '/public/images/'].some((prefix) => parsedUrl.pathname.startsWith(prefix)) &&
        ['localhost', '127.0.0.1', 'fitematch.com.br', 'www.fitematch.com.br'].includes(
          parsedUrl.hostname,
        );

      if (isFirstPartyPublicAsset) {
        return `${normalizedPath}${parsedUrl.search}${parsedUrl.hash}`;
      }
    } catch {
      return url;
    }

    return url;
  }

  const normalizedUrl = normalizePublicAssetPath(url);

  if (normalizedUrl.startsWith('/images/')) {
    return normalizedUrl;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return normalizedUrl;
  }

  return `${apiBaseUrl.replace(/\/+$/, '')}/${normalizedUrl.replace(/^\/+/, '')}`;
}
