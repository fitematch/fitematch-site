import { notFound } from "next/navigation";

import InternalPageChrome from "@/components/Common/InternalPageChrome";
import AuthRouteGuard from "@/components/Common/AuthRouteGuard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/auth-context";
import { LocaleProvider } from "@/contexts/locale-context";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <LocaleProvider locale={locale} dictionary={getDictionary(locale)}>
      <AuthProvider>
        <AuthRouteGuard>
          <div className="isolate">
            <Header />
            <InternalPageChrome />
            {children}
            <Footer />
          </div>
          <ScrollToTop />
        </AuthRouteGuard>
      </AuthProvider>
    </LocaleProvider>
  );
}
