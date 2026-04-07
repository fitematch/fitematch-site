export const locales = ["pt", "es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";
export const localeCookieName = "fitematch-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [, maybeLocale] = pathname.split("/");

  return maybeLocale && isLocale(maybeLocale) ? maybeLocale : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return pathname;
  }

  const nextPath = pathname.replace(`/${locale}`, "");

  return nextPath || "/";
}

export function localizePath(pathname: string, locale: Locale) {
  if (!pathname.startsWith("/")) {
    return pathname;
  }

  if (getLocaleFromPathname(pathname)) {
    return pathname.replace(/^\/(pt|es|en)(?=\/|$)/, `/${locale}`);
  }

  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}
