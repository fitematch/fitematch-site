export const SITE_NAME = 'fitematch';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'http://localhost:3000';
export const DEFAULT_TITLE = 'fitematch';
export const DEFAULT_DESCRIPTION =
  'Conecte profissionais de educação física às melhores vagas em academias, studios e empresas fitness.';
export const DEFAULT_OG_IMAGE = '/images/og/fitematch-og.png';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}/${path.replace(/^\/+/, '')}`;
}

export function buildTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}
