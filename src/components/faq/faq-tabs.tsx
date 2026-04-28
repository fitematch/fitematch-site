'use client';

import { useState } from 'react';
import { FaBuilding, FaUser } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/theme';
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
    answer:
      'No cadastro, selecione o perfil de recrutador e preencha seus dados básicos.',
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
  const [activeTab, setActiveTab] = useState<'candidate' | 'recruiter'>(
    'candidate',
  );

  const items = activeTab === 'candidate' ? candidateFaq : recruiterFaq;

  return (
    <div>
      <div className={`mb-8 flex gap-3 ${THEME.text.body}`}>
        <Button
          type="button"
          variant={activeTab === 'candidate' ? 'positive' : 'ghost'}
          icon={<FaUser />}
          onClick={() => setActiveTab('candidate')}
        >
          Candidatos
        </Button>

        <Button
          type="button"
          variant={activeTab === 'recruiter' ? 'positive' : 'ghost'}
          icon={<FaBuilding />}
          onClick={() => setActiveTab('recruiter')}
        >
          Recrutadores
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
