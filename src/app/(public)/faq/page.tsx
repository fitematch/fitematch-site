import { PAGE_STYLES, TEXT_STYLES } from '@/constants/styles';
import { FaqTabs } from '@/components/faq/faq-tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';

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

        <h1 className={`${TEXT_STYLES.sectionTitle} mt-8`}>
          FAQ
        </h1>

        <p className={TEXT_STYLES.sectionSubtitle}>
          Tire suas dúvidas sobre cadastro, ativação, vagas e aplicações.
        </p>

        <div className="mt-10">
          <FaqTabs />
        </div>
      </div>
    </section>
  );
}
