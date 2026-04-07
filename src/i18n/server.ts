import { cookies } from "next/headers";

import { defaultLocale, isLocale, localeCookieName, Locale } from "./config";
import { getDictionary } from "./dictionaries";

export async function getCurrentLocale(localeOverride?: string): Promise<Locale> {
  if (localeOverride && isLocale(localeOverride)) {
    return localeOverride;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  return cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

export async function getServerDictionary(localeOverride?: string) {
  const locale = await getCurrentLocale(localeOverride);

  return {
    locale,
    dictionary: getDictionary(locale),
  };
}
