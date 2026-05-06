import { Metadata } from 'next';
import { FaShieldAlt } from 'react-icons/fa';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PrivacyPolicyContent } from '@/components/legal/privacy-policy-content';
import { ROUTES } from '@/constants/routes';
import { CARD_STYLES, PAGE_STYLES, TEXT_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/constants/seo';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Entenda como a fitematch trata seus dados pessoais.',
  alternates: {
    canonical: absoluteUrl('/privacy-policy'),
  },
  openGraph: {
    title: `Política de Privacidade | ${SITE_NAME}`,
    description: 'Entenda como a fitematch trata seus dados pessoais.',
    url: absoluteUrl('/privacy-policy'),
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Política de Privacidade | ${SITE_NAME}`,
    description: 'Entenda como a fitematch trata seus dados pessoais.',
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Política de Privacidade' },
          ]}
        />

        <div className="mt-8">
          <h1 className={TEXT_STYLES.sectionTitle}>Política de Privacidade</h1>
          <p className={TEXT_STYLES.sectionSubtitle}>
            Resumo do tratamento de dados na plataforma fitematch.
          </p>
        </div>

        <div className={`${CARD_STYLES.featureBox} mt-10`}>
          <div className="mb-6 flex items-center gap-3">
            <FaShieldAlt className={`h-5 w-5 ${THEME.icon.default}`} />
            <h2 className={TEXT_STYLES.featureTitle}>Leitura rápida</h2>
          </div>

          <PrivacyPolicyContent />
        </div>
      </div>
    </section>
  );
}
