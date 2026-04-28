'use client';

import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthSessions } from '@/hooks/use-auth-sessions';
import { SessionCard } from './session-card';

export function SessionList() {
  const { sessions, isLoading, error, revokeSession } = useAuthSessions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (sessions.length === 0) {
    return (
      <EmptyState message="Nenhuma sessão encontrada para sua conta." />
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onRevoke={revokeSession}
        />
      ))}
    </div>
  );
}