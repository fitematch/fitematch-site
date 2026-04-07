import { LocaleProvider } from "@/contexts/locale-context";
import { AuthProvider } from "@/contexts/auth-context";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../styles/index.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="bg-[#FCFCFC]">
        <LocaleProvider
          locale={defaultLocale}
          dictionary={getDictionary(defaultLocale)}
        >
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
