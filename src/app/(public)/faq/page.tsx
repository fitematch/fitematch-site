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
        <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/80 px-6 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_30%)]" />
          <div className="relative">
            <Breadcrumb items={[{ label: 'Home', href: ROUTES.HOME }, { label: 'FAQ' }]} />
            <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-lime-400">
              Central de ajuda
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-zinc-50 sm:text-5xl">
              Dúvidas frequentes com a mesma clareza do produto.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Tire dúvidas sobre cadastro, ativação, vagas, aplicações e operação da plataforma em
              uma experiência mais limpa e direta.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <FaqTabs />
        </div>
      </div>
    </section>
  );
}
