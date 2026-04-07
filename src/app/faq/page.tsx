import type { Metadata } from "next";
import FaqAccordion from "@/components/Faq/FaqAccordion";

export const metadata: Metadata = {
  title: "fitematch | FAQ",
  description: "Perguntas frequentes sobre a plataforma fitematch.",
};

const faqItems = [
  {
    question: "O que é a fitematch?",
    answer:
      "A fitematch conecta profissionais e empresas do mercado fitness. Candidatos podem buscar vagas e se candidatar. Recrutadores podem publicar oportunidades e acompanhar inscrições.",
  },
  {
    question: "Quem pode criar conta na plataforma?",
    answer:
      "Existem dois perfis principais: candidato e recrutador. O candidato usa a plataforma para encontrar oportunidades. O recrutador usa para divulgar vagas e gerenciar processos seletivos.",
  },
  {
    question: "Como faço para me candidatar a uma vaga?",
    answer:
      "Basta criar sua conta, acessar a lista de vagas, abrir os detalhes da oportunidade desejada e confirmar sua candidatura na página da vaga.",
  },
  {
    question: "Quais tipos de vaga posso encontrar na fitematch?",
    answer:
      "As vagas podem aparecer em formatos como Estágio, Autônomo, CLT e PJ, dependendo do que foi publicado pela empresa contratante.",
  },
  {
    question: "Como funciona a busca de vagas?",
    answer:
      "Na página de vagas, você pode usar o campo de busca para filtrar oportunidades pelo nome da empresa, título da vaga, cidade, estado e também pelo tipo da vaga.",
  },
  {
    question: "Como um recrutador publica uma vaga?",
    answer:
      "Depois de criar a conta de recrutador e acessar a área da conta, é possível abrir o formulário de anúncio, preencher os dados da vaga e publicar a oportunidade.",
  },
  {
    question: "Consigo acompanhar minhas candidaturas?",
    answer:
      "Sim. O candidato pode acessar a área de processos seletivos para visualizar as vagas em que já se candidatou e acompanhar seu histórico dentro da plataforma.",
  },
  {
    question: "Posso editar meus dados de perfil?",
    answer:
      "Sim. Na área da conta, você pode atualizar informações pessoais, documentos, contatos e redes sociais para manter seu perfil completo e atualizado.",
  },
  {
    question: "As vagas em destaque são diferentes das demais?",
    answer:
      "As vagas em destaque recebem mais visibilidade dentro da listagem, mas continuam sendo oportunidades normais cadastradas por recrutadores na plataforma.",
  },
  {
    question: "Preciso pagar para usar a plataforma?",
    answer:
      "O uso pode variar conforme o perfil e a funcionalidade disponível na plataforma. Para o candidato, o foco é buscar vagas e se candidatar. Para o recrutador, a plataforma oferece recursos de publicação e gestão de vagas.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
            <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
              FAQ
            </span>
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              Perguntas frequentes
            </h1>
            <p className="text-body-color text-base leading-relaxed md:text-lg">
              Reunimos aqui respostas objetivas sobre cadastro, vagas,
              candidaturas e o funcionamento da fitematch para candidatos e
              recrutadores.
            </p>
          </div>

          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </main>
  );
}
