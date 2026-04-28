'use client';

import { FaDesktop, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { AuthSessionResponse } from '@/services/auth/auth.types';
import { useFlashMessage } from '@/contexts/flash-message-context';

interface SessionCardProps {
  session: AuthSessionResponse;
  onRevoke: (sessionId: string) => Promise<void>;
}

export function SessionCard({ session, onRevoke }: SessionCardProps) {
  const { showSuccess, showError } = useFlashMessage();

  const isRevoked = Boolean(session.revokedAt);

  async function handleRevoke() {
    try {
      await onRevoke(session.id);
      showSuccess('Sessão revogada com sucesso.');
    } catch {
      showError('Não foi possível revogar a sessão.');
    }
  }

  return (
    <article className="rounded-xl border border-gray-900 p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaDesktop />
            <span className="text-sm uppercase">
              {isRevoked ? 'Revogada' : 'Ativa'}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-gray-100">
            {session.userAgent || 'Dispositivo desconhecido'}
          </h3>

          <div className="mt-3 space-y-1 text-sm text-gray-700">
            {session.ipAddress && <p>IP: {session.ipAddress}</p>}
            <p>Expira em: {String(session.expiresAt)}</p>
            {session.createdAt && <p>Criada em: {String(session.createdAt)}</p>}
            {session.revokedAt && <p>Revogada em: {String(session.revokedAt)}</p>}
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
