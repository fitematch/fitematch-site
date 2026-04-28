import { ReactNode } from 'react';

export function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-lg rounded-xl border border-gray-900 bg-black p-6">
        {children}

        <button
          onClick={onClose}
          className="mt-6 text-gray-700 hover:text-gray-500"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
