import {
  FaAndroid,
  FaApple,
  FaBriefcase,
  FaBuilding,
  FaClipboardCheck,
  FaUserCheck,
} from 'react-icons/fa';
import { SectionTitle } from '@/components/ui/section-title';
import { TEXT_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';

const features = [
  {
    icon: FaBriefcase,
    title: 'Vagas para profissionais fitness',
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
    <section className={`${THEME.layout.background} py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Funcionalidades da plataforma"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`rounded-xl border ${THEME.layout.border} ${THEME.layout.background} p-6`}
              >
                <Icon className={`h-8 w-8 ${THEME.icon.default}`} />

                <h3 className={`mt-4 text-xl font-semibold ${THEME.card.title}`}>
                  {feature.title}
                </h3>

                <p className={`mt-3 text-sm ${THEME.card.text}`}>
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
