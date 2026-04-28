import { FaFileContract, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { TermsOfUseContent } from '@/components/legal/terms-of-use-content';
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

            <h2 className={`text-xl font-bold ${THEME.card.featureTitle}`}>
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

        <TermsOfUseContent />

        <div className="mt-6 flex justify-end">
          <Button variant="profile" icon={<FaTimes />} onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
