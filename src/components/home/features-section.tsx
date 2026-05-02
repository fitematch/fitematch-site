import { ReactNode } from 'react';
import {
  FaAndroid,
  FaApple,
  FaBriefcase,
  FaBuilding,
  FaClipboardCheck,
  FaUserCheck,
} from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { PAGE_STYLES } from '@/constants/styles';
import { SectionTitle } from '@/components/ui/section-title';

const features = [
  {
    icon: FaBriefcase,
    title: 'Vagas para profissionais',
    description: 'Busque oportunidades em academias e empresas do setor fitness.',
  },
  {
    icon: FaUserCheck,
    title: 'Perfil completo de candidato',
    description: 'Dados ricos para gerar matches mais precisos entre perfil e vaga.',
  },
  {
    icon: FaBuilding,
    title: 'Cadastro de empresas',
    description: 'Recrutadores podem solicitar inclusão da empresa na plataforma.',
  },
  {
    icon: FaClipboardCheck,
    title: 'Gestão de aplicações',
    description: 'Candidatos aplicam e recrutadores filtram perfis e acompanham os status.',
  },
  {
    icon: FaAndroid,
    title: 'Aplicativo Android',
    description: (
      <>
        Aplicativo em desenvolvimento para{' '}
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Play Store
        </a>
      </>
    ),
  },
  {
    icon: FaApple,
    title: 'Aplicativo iOS',
    description: (
      <>
        Aplicativo em desenvolvimento para{' '}
        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Apple Store
        </a>
      </>
    ),
  },
];

type Feature = {
  icon: typeof FaBriefcase;
  title: string;
  description: ReactNode;
};

const typedFeatures: Feature[] = features;

export function FeaturesSection() {
  return (
    <section className={`bg-gray-800 ${PAGE_STYLES.section}`}>
      <div className={PAGE_STYLES.container}>
        <SectionTitle
          title="FUNCIONALIDADES DA PLATAFORMA"
          icon={<IoMdSettings />}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {typedFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-100 bg-black p-6 transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-8 w-8 text-gray-100 transition-colors group-hover:text-black" />
                  <h3 className="text-xl font-semibold text-gray-100 transition-colors group-hover:text-black">
                    {feature.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm text-gray-300 transition-colors group-hover:text-gray-700">
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
