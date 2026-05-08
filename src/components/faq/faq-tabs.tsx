'use client';

import { useState } from 'react';
import { Building2, UserRound } from 'lucide-react';
import { FaqItem } from './faq-item';

const candidateFaq = [
  {
    question: 'Como criar minha conta?',
    answer:
      'Acesse a página de cadastro, escolha o perfil de candidato, preencha seus dados básicos e aceite os Termos de Uso e a Política de Privacidade.',
  },
  {
    question: 'Como ativar minha conta?',
    answer:
      'Após o cadastro, solicite um código de ativação e informe o código recebido na página de ativação de conta.',
  },
  {
    question: 'Como me aplicar a uma vaga?',
    answer:
      'Entre com sua conta, acesse a página de detalhes da vaga e clique em Aplicar-se à vaga.',
  },
  {
    question: 'Preciso preencher dados complementares?',
    answer:
      'Sim. O perfil completo ajuda recrutadores a entenderem sua formação, experiências, documentos, disponibilidade e dados profissionais.',
  },
];

const recruiterFaq = [
  {
    question: 'Como criar uma conta de recrutador?',
    answer: 'No cadastro, selecione o perfil de recrutador e preencha seus dados básicos.',
  },
  {
    question: 'Como cadastrar minha empresa?',
    answer:
      'Após entrar na plataforma, acesse a área de recrutador e envie uma solicitação de cadastro da empresa.',
  },
  {
    question: 'Como publicar uma vaga?',
    answer:
      'Depois que sua empresa estiver cadastrada, você poderá enviar uma nova vaga. A vaga entrará com status pendente.',
  },
  {
    question: 'Como atualizar meu perfil?',
    answer:
      'Use a página Profile para atualizar seus dados básicos e complementares pelo endpoint auth/me.',
  },
];

export function FaqTabs() {
  const [activeTab, setActiveTab] = useState<'candidate' | 'recruiter'>('candidate');

  const items = activeTab === 'candidate' ? candidateFaq : recruiterFaq;

  return (
    <div>
      <div className="mb-8 inline-flex rounded-2xl border border-zinc-800 bg-zinc-950/90 p-1 backdrop-blur">
        <button
          type="button"
          onClick={() => setActiveTab('candidate')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'candidate'
              ? 'bg-lime-500/10 text-lime-300'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <UserRound className="h-4 w-4" />
          Candidatos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recruiter')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'recruiter'
              ? 'bg-lime-500/10 text-lime-300'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Recrutadores
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
