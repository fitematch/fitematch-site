"use client";

import { createContext, useContext } from "react";

import { Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";

type Dictionary = (typeof dictionaries)[Locale];

const LocaleContext = createContext<{
  dictionary: Dictionary;
  locale: Locale;
} | null>(null);

export function LocaleProvider({
  children,
  dictionary,
  locale,
}: Readonly<{
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}>) {
  return (
    <LocaleContext.Provider value={{ dictionary, locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context.locale;
}

export function useDictionary() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useDictionary must be used inside LocaleProvider");
  }

  return context.dictionary;
}
