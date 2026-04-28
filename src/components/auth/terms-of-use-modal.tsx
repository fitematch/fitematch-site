import { FaFileContract, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/theme';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfUseModal({ isOpen, onClose }: TermsOfUseModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className={`max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border ${THEME.layout.border} ${THEME.layout.background} p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaFileContract className={`h-5 w-5 ${THEME.icon.default}`} />

            <h2 className={`text-xl font-bold ${THEME.card.title}`}>
              Termos de Uso
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={THEME.text.link}
          >
            <FaTimes />
          </button>
        </div>

        <div className={`space-y-4 text-sm leading-6 ${THEME.text.body}`}>
          <p>
            Ao utilizar a fitematch, você concorda com as regras de uso da
            plataforma, incluindo o cadastro correto das suas informações e o
            uso responsável dos recursos disponíveis.
          </p>

          <p>
            Candidatos devem fornecer dados verdadeiros sobre sua formação,
            experiência profissional, disponibilidade e documentos quando
            solicitados.
          </p>

          <p>
            Recrutadores devem cadastrar empresas e vagas com informações
            reais, claras e compatíveis com as oportunidades oferecidas.
          </p>

          <p>
            A fitematch poderá suspender ou remover contas que utilizem dados
            falsos, pratiquem abuso da plataforma ou violem estes termos.
          </p>

          <p>
            Este texto é uma versão inicial para o MVP e poderá ser substituído
            por uma versão jurídica definitiva futuramente.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="profile" icon={<FaTimes />} onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
