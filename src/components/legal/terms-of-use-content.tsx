import { THEME } from '@/constants/theme';

export function TermsOfUseContent() {
  return (
    <div className={`space-y-4 text-sm leading-6 ${THEME.text.body}`}>
      <p>
        Ao utilizar a fitematch, você concorda com as regras de uso da
        plataforma, incluindo o cadastro correto das suas informações e o uso
        responsável dos recursos disponíveis.
      </p>

      <p>
        Candidatos devem fornecer dados verdadeiros sobre sua formação,
        experiência profissional, disponibilidade e documentos quando
        solicitados.
      </p>

      <p>
        Recrutadores devem cadastrar empresas e vagas com informações reais,
        claras e compatíveis com as oportunidades oferecidas.
      </p>

      <p>
        A fitematch poderá suspender ou remover contas que utilizem dados
        falsos, pratiquem abuso da plataforma ou violem estes termos.
      </p>

      <p>
        Este texto é uma versão inicial para o MVP e poderá ser substituído por
        uma versão jurídica definitiva futuramente.
      </p>
    </div>
  );
}
