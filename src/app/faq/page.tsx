import type { Metadata } from "next";
import FaqAccordion from "@/components/Faq/FaqAccordion";
import { isLocale } from "@/i18n/config";
import { getServerDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "fitematch | FAQ",
  description: "Perguntas frequentes sobre a plataforma fitematch.",
};

export default async function FaqPage({
  params,
}: Readonly<{
  params?: Promise<{ locale?: string }>;
}>) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale;
  const { dictionary } = await getServerDictionary(
    isLocale(locale ?? "") ? locale : undefined,
  );
  const faqItems = dictionary.faq.items.map(([question, answer]) => ({
    question,
    answer,
  }));

  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
            <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
              {dictionary.faq.eyebrow}
            </span>
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              {dictionary.faq.title}
            </h1>
            <p className="text-body-color text-base leading-relaxed md:text-lg">
              {dictionary.common.faqIntro}
            </p>
          </div>

          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </main>
  );
}
