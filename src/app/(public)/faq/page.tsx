import { Metadata } from 'next';
import { FaqTabs } from '@/components/faq/faq-tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/constants/seo';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Dúvidas frequentes sobre a fitematch.',
  alternates: {
    canonical: absoluteUrl('/faq'),
  },
  openGraph: {
    title: `FAQ | ${SITE_NAME}`,
    description: 'Dúvidas frequentes sobre a fitematch.',
    url: absoluteUrl('/faq'),
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `FAQ | ${SITE_NAME}`,
    description: 'Dúvidas frequentes sobre a fitematch.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function FaqPage() {
  return (
    <section className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: ROUTES.HOME }, { label: 'FAQ' }]} />
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-lime-400">
          Perguntas Mais Frequentes
        </p>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
          Tire dúvidas sobre cadastro, ativação, vagas e aplicações.
        </p>

        <div className="mt-12">
          <FaqTabs />
        </div>
      </div>
    </section>
  );
}
