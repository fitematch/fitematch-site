'use client';

import { FaDesktop, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { AuthSessionResponse } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { getFriendlySessionDevice } from '@/utils/session-device';

interface SessionCardProps {
  session: AuthSessionResponse;
  onRevoke: (sessionId: string) => Promise<void>;
}

function formatSessionDate(value?: string | Date) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
}

function formatSessionDuration(
  createdAt?: string | Date,
  revokedAt?: string | Date,
  expiresAt?: string | Date
) {
  if (!createdAt) {
    return null;
  }

  const createdAtDate = new Date(createdAt);
  const endDate = revokedAt ? new Date(revokedAt) : new Date();

  if (
    Number.isNaN(createdAtDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return null;
  }

  const maxEndDate =
    expiresAt && !revokedAt && !Number.isNaN(new Date(expiresAt).getTime())
      ? new Date(Math.min(endDate.getTime(), new Date(expiresAt).getTime()))
      : endDate;
  const diffInMs = maxEndDate.getTime() - createdAtDate.getTime();

  if (diffInMs <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diffInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function SessionCard({ session, onRevoke }: SessionCardProps) {
  const { showSuccess, showError } = useFlashMessage();

  const isRevoked = Boolean(session.revokedAt);
  const createdAtLabel = formatSessionDate(session.createdAt);
  const expiresAtLabel = formatSessionDate(session.expiresAt);
  const revokedAtLabel = formatSessionDate(session.revokedAt);
  const totalSessionTime = formatSessionDuration(
    session.createdAt,
    session.revokedAt,
    session.expiresAt
  );

  async function handleRevoke() {
    try {
      await onRevoke(session.id);
      showSuccess('Sessão revogada com sucesso.');
    } catch {
      showError('Não foi possível revogar a sessão.');
    }
  }

  return (
    <article className="rounded-2xl border border-gray-500 bg-black p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className={`flex items-center gap-3 ${isRevoked ? 'text-red-100' : 'text-green-100'}`}>
            <FaDesktop />
            <span className="text-sm uppercase">
              {isRevoked ? 'Revogada' : 'Ativa'}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-gray-100">
            {getFriendlySessionDevice(session.userAgent)}
          </h3>

          <div className="mt-3 space-y-1 text-sm text-gray-300">
            {session.ipAddress && <p>IP: {session.ipAddress}</p>}
            {createdAtLabel && (
              <p className={!isRevoked ? 'text-green-100' : undefined}>
                Criada em: {createdAtLabel}
              </p>
            )}
            {expiresAtLabel && <p className="text-blue-100">Expira em: {expiresAtLabel}</p>}
            {revokedAtLabel && (
              <p className="text-red-100">
                Revogada em: {revokedAtLabel}
              </p>
            )}
            {totalSessionTime && <p className="font-semibold">Tempo total: {totalSessionTime}</p>}
          </div>
        </div>

        {!isRevoked && (
          <Button
            type="button"
            variant="danger"
            icon={<FaTrash />}
            onClick={handleRevoke}
          >
            Revogar
          </Button>
        )}
      </div>
    </article>
  );
}
