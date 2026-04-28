'use client';

import { usePathname } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ROUTES } from '@/constants/routes';
import { FLASH_MESSAGE_STYLES } from '@/constants/styles';
import { useFlashMessage } from '@/contexts/flash-message-context';

export function FlashMessage() {
  const pathname = usePathname();
  const { flashMessage, closeFlashMessage } = useFlashMessage();

  const hiddenRoutes = new Set([
    ROUTES.SIGN_IN,
    ROUTES.SIGN_UP,
    ROUTES.ACTIVATION_CODE,
    ROUTES.ACTIVATE_ACCOUNT,
  ]);

  if (!flashMessage || hiddenRoutes.has(pathname)) {
    return null;
  }

  const Icon = flashMessage.type === 'success' ? FaCheckCircle : FaTimesCircle;

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex max-w-md items-center gap-3 rounded-md px-4 py-3 shadow-lg ${FLASH_MESSAGE_STYLES[flashMessage.type]}`}
    >
      <Icon className="h-5 w-5" />

      <p className="text-sm font-medium">
        {flashMessage.message}
      </p>

      <button
        type="button"
        onClick={closeFlashMessage}
        className="ml-2 text-sm opacity-80 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
