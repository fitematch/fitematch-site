import { ReactNode } from 'react';

export function Modal({
  isOpen,
  onClose,
  children,
  contentClassName = 'max-w-lg',
  showDefaultClose = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
  showDefaultClose?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div
        className={`w-full rounded-xl border border-gray-900 bg-black p-6 ${contentClassName}`}
      >
        {children}

        {showDefaultClose && (
          <button
            onClick={onClose}
            className="mt-6 text-gray-700 hover:text-gray-500"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
