import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getServerDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "fitematch | Política de Privacidade",
  description: "Conheça a política de privacidade da fitematch.",
};

export default async function PrivacyPolicyPage({
  params,
}: Readonly<{
  params?: Promise<{ locale?: string }>;
}>) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale;
  const { dictionary } = await getServerDictionary(
    isLocale(locale ?? "") ? locale : undefined,
  );

  return (
    <main className="bg-white pt-8 pb-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
            <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
              {dictionary.publicPages.privacyEyebrow}
            </span>
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              {dictionary.publicPages.privacyTitle}
            </h1>
            <p className="text-body-color text-base leading-relaxed md:text-lg">
              {dictionary.common.privacyIntro}
            </p>
          </div>
        </div>
      </main>
  );
}
