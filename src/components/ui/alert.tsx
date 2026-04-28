import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FLASH_MESSAGE_STYLES } from '@/constants/styles';

export function Alert({
  type,
  message,
}: {
  type: 'success' | 'error';
  message: string;
}) {
  const Icon = type === 'success' ? FaCheckCircle : FaTimesCircle;

  return (
    <div className={`flex items-center gap-2 rounded-md px-4 py-3 ${FLASH_MESSAGE_STYLES[type]}`}>
      <Icon />
      <span>{message}</span>
    </div>
  );
}
