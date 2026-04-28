import {
  FaAndroid,
  FaApple,
  FaBriefcase,
  FaBuilding,
  FaClipboardCheck,
  FaUserCheck,
} from 'react-icons/fa';
import { SectionTitle } from '@/components/ui/section-title';
import { CARD_STYLES, PAGE_STYLES, TEXT_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';

const features = [
  {
    icon: FaBriefcase,
    title: 'Vagas para profissionais',
    description: 'Busque oportunidades em academias e empresas do setor fitness.',
  },
  {
    icon: FaUserCheck,
    title: 'Perfil completo de candidato',
    description: 'Preencha dados profissionais, experiências, documentos e disponibilidade.',
  },
  {
    icon: FaBuilding,
    title: 'Cadastro de empresas',
    description: 'Recrutadores podem solicitar inclusão da empresa na plataforma.',
  },
  {
    icon: FaClipboardCheck,
    title: 'Gestão de aplicações',
    description: 'Candidatos aplicam e recrutadores acompanham os status.',
  },
  {
    icon: FaAndroid,
    title: 'Aplicativo Android',
    description: 'Em desenvolvimento. Em breve disponível na Play Store.',
  },
  {
    icon: FaApple,
    title: 'Aplicativo iOS',
    description: 'Em desenvolvimento. Em breve disponível na Apple Store.',
  },
];

export function FeaturesSection() {
  return (
    <section className={`${THEME.layout.background} ${PAGE_STYLES.section}`}>
      <div className={PAGE_STYLES.container}>
        <SectionTitle
          title="Funcionalidades da plataforma"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={CARD_STYLES.featureBox}
              >
                <div className="flex items-center gap-3">
                  <Icon className={CARD_STYLES.featureIcon} />
                  <h3 className={TEXT_STYLES.featureTitle}>
                    {feature.title}
                  </h3>
                </div>

                <p className={`mt-3 ${TEXT_STYLES.featureText}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
