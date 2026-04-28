import { THEME } from '@/constants/theme';

export function PrivacyPolicyContent() {
  return (
    <div className={`space-y-4 text-sm leading-6 ${THEME.text.body}`}>
      <p>
        A fitematch coleta dados necessários para criação de conta,
        autenticação, ativação de conta, preenchimento de perfil, busca por
        vagas e aplicações em oportunidades.
      </p>

      <p>
        Os dados podem incluir nome, e-mail, data de nascimento, telefone,
        documentos, experiências profissionais, formações, disponibilidade e
        demais informações fornecidas pelo próprio usuário.
      </p>

      <p>
        Esses dados são utilizados para permitir que candidatos encontrem vagas
        e que recrutadores avaliem perfis de acordo com as oportunidades
        cadastradas.
      </p>

      <p>
        A fitematch não deve compartilhar dados pessoais fora das finalidades
        necessárias para funcionamento da plataforma, salvo quando houver
        obrigação legal ou autorização do usuário.
      </p>

      <p>
        Este texto é uma versão inicial para o MVP e poderá ser substituído por
        uma versão jurídica definitiva futuramente.
      </p>
    </div>
  );
}
