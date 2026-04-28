import { FaShieldAlt, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/theme';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className={`max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border ${THEME.layout.border} ${THEME.layout.background} p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaShieldAlt className={`h-5 w-5 ${THEME.icon.default}`} />

            <h2 className={`text-xl font-bold ${THEME.card.title}`}>
              Política de Privacidade
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
            Esses dados são utilizados para permitir que candidatos encontrem
            vagas e que recrutadores avaliem perfis de acordo com as
            oportunidades cadastradas.
          </p>

          <p>
            A fitematch não deve compartilhar dados pessoais fora das
            finalidades necessárias para funcionamento da plataforma, salvo
            quando houver obrigação legal ou autorização do usuário.
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
