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
    <section className={`bg-[#0f141a] ${PAGE_STYLES.section}`}>
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
                className="group rounded-[1.4rem] border border-slate-700/70 bg-zinc-950/92 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-1 hover:border-slate-500 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-700/70 bg-black/60 p-3 transition-colors group-hover:border-gray-300 group-hover:bg-white">
                    <Icon className="h-6 w-6 text-gray-100 transition-colors group-hover:text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 transition-colors group-hover:text-black">
                    {feature.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-300 transition-colors group-hover:text-gray-700">
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
