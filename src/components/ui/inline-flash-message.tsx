'use client';

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FLASH_MESSAGE_STYLES } from '@/constants/styles';

interface InlineFlashMessageProps {
  type: 'success' | 'error';
  message: string;
}

export function InlineFlashMessage({
  type,
  message,
}: InlineFlashMessageProps) {
  const Icon = type === 'success' ? FaCheckCircle : FaTimesCircle;

  return (
    <div
      className={`flex items-center gap-3 rounded-md px-4 py-3 shadow-lg ${FLASH_MESSAGE_STYLES[type]}`}
    >
      <Icon className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
