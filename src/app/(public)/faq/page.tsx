import { Metadata } from 'next';
import { PAGE_STYLES, TEXT_STYLES } from '@/constants/styles';
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
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'FAQ' },
          ]}
        />
        <h1 className={`${TEXT_STYLES.pageTitle} mt-8`}>
          FAQ
        </h1>
        <p className={TEXT_STYLES.pageSubtitle}>
          Tire suas dúvidas sobre cadastro, ativação, vagas e aplicações.
        </p>
        <div className="mt-10">
          <FaqTabs />
        </div>
      </div>
    </section>
  );
}
