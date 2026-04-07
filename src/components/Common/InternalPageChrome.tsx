"use client";

import { usePathname } from "next/navigation";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { useDictionary, useLocale } from "@/contexts/locale-context";

const Star = ({
  className,
  size = 20,
}: {
  className: string;
  size?: number;
}) => (
  <span className={className}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary/30"
    >
      <path
        d="M12 2.5L13.9 10.1L21.5 12L13.9 13.9L12 21.5L10.1 13.9L2.5 12L10.1 10.1L12 2.5Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

const getBreadcrumbContent = (
  pathname: string,
  dictionary: ReturnType<typeof useDictionary>,
  locale: ReturnType<typeof useLocale>,
) => {
  if (pathname === "/account/login") {
    return {
      pageName: "Login",
      description:
        "Acesse sua conta para acompanhar vagas, candidaturas, alertas e comunicações da plataforma.",
    };
  }

  if (pathname === "/account/logout") {
    return {
      pageName: "Logout",
      description:
        "Encerrando sua sessao e limpando o acesso autenticado da plataforma.",
    };
  }

  if (pathname === "/account/signup") {
    return {
      pageName: "Cadastro",
      description:
        "Escolha o perfil de acesso para continuar o seu cadastro na plataforma.",
    };
  }

  if (pathname === "/account") {
    return {
      pageName: "Minha Conta",
      description:
        "Acesse a area principal da sua conta e navegue pelos recursos disponiveis para usuarios autenticados.",
    };
  }

  if (pathname === "/account/candidate") {
    return {
      pageName: "Candidato",
      description:
        "Cadastro para criar perfil, acompanhar candidaturas e receber alertas.",
    };
  }

  if (pathname === "/account/candidate/register") {
    return {
      pageName: "Cadastro de Candidato",
      description:
        "Crie sua conta para buscar e se aplicar a vagas.",
    };
  }

  if (pathname === "/account/recruiter") {
    return {
      pageName: "Recrutador",
      description:
        "Cadastro para criar vagas e acompanhar candidatos.",
    };
  }

  if (pathname === "/account/recruiter/register") {
    return {
      pageName: "Cadastro de Recrutador",
      description:
        "Crie sua conta e públique vagas e acompanhe as aplicações.",
    };
  }

  if (pathname === "/account/profile") {
    return {
      pageName: "Perfil",
      description:
        "Consulte as informacoes da sua conta.",
    };
  }

  if (pathname === "/account/advertisement") {
    return {
      pageName: "Anúncios",
      description:
        "Crie e acompanhe anuncios de vagas.",
    };
  }

  if (pathname === "/jobs/applications") {
    return {
      pageName: "Processos Seletivos",
      description:
        "Acompanhe seus processos seletivos e gerencie suas candidaturas.",
    };
  }

  if (pathname === "/account/membership") {
    return {
      pageName: "Assinatura",
      description:
        "Consulte beneficios e recursos disponiveis para a sua conta.",
    };
  }

  if (pathname === "/account/security") {
    return {
      pageName: "Segurança",
      description:
        "Verifique seus acessos e gerencie dispositivos conectados.",
    };
  }

  if (pathname === "/jobs") {
    return {
      pageName: dictionary.common.jobs,
      description:
        locale === "es"
          ? "Explora oportunidades para diferentes perfiles, modalidades y unidades."
          : locale === "en"
            ? "Explore opportunities for different profiles, formats and units."
            : "Explore oportunidades para diferentes perfis, modalidades e unidades.",
    };
  }

  if (pathname === "/faq") {
    return {
      pageName: dictionary.common.faq,
      description:
        locale === "es"
          ? "Encuentra respuestas a las principales dudas de candidatos y reclutadores sobre la plataforma."
          : locale === "en"
            ? "Find answers to the main questions from candidates and recruiters about the platform."
            : "Encontre respostas para as principais dúvidas de candidatos e recrutadores sobre a plataforma.",
    };
  }

  if (pathname === "/privacy-policy") {
    return {
      pageName: dictionary.common.privacyPolicy,
      description:
        locale === "es"
          ? "Consulta cómo fitematch recopila, trata, almacena y protege los datos de la plataforma."
          : locale === "en"
            ? "See how fitematch collects, processes, stores and protects platform data."
            : "Consulte como a fitematch coleta, trata, armazena e protege os dados da plataforma.",
    };
  }

  if (pathname === "/terms-of-use") {
    return {
      pageName: dictionary.common.termsOfUse,
      description:
        locale === "es"
          ? "Consulta las reglas, responsabilidades y condiciones para usar la plataforma fitematch."
          : locale === "en"
            ? "See the rules, responsibilities and conditions for using the fitematch platform."
            : "Veja as regras, responsabilidades e condições para uso da plataforma fitematch.",
    };
  }

  const jobMatch = pathname.match(/^\/job\/([^/]+)\/details$/);
  if (jobMatch) {
    return {
      pageName: "Detalhes da Vaga",
      description:
        "Confira os detalhes da vaga e avance para a candidatura.",
    };
  }

  return null;
};

export default function InternalPageChrome() {
  const dictionary = useDictionary();
  const locale = useLocale();
  const pathname = usePathname().replace(/^\/(pt|es|en)(?=\/|$)/, "") || "/";

  if (pathname === "/" || /^\/job\/[^/]+\/details$/.test(pathname)) {
    return null;
  }

  const breadcrumb = getBreadcrumbContent(pathname, dictionary, locale);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#FCFCFC]" />
        <Star className="absolute left-[8%] top-[140px] hidden md:block" size={22} />
        <Star className="absolute right-[10%] top-[180px]" size={18} />
        <Star className="absolute left-[14%] top-[38%]" size={14} />
        <Star className="absolute right-[16%] top-[42%] hidden lg:block" size={24} />
        <Star className="absolute left-[10%] bottom-[26%]" size={18} />
        <Star className="absolute right-[12%] bottom-[20%]" size={16} />
        <Star className="absolute left-[50%] top-[22%] hidden xl:block" size={12} />
        <Star className="absolute left-[58%] bottom-[28%] hidden md:block" size={14} />
        <div className="absolute left-[-120px] top-[220px] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[-140px] top-[120px] h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      {breadcrumb ? (
        <Breadcrumb
          pageName={breadcrumb.pageName}
          description={breadcrumb.description}
        />
      ) : null}
    </>
  );
}
