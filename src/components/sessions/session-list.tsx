'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { PaginationBox } from '@/components/ui/pagination-box';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthSessions } from '@/hooks/use-auth-sessions';
import { SessionCard } from './session-card';

export function SessionList() {
  const { sessions, isLoading, error, revokeSession } = useAuthSessions();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paginatedSessions = sessions.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl border border-gray-500 bg-black" />
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
      {paginatedSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onRevoke={revokeSession}
        />
      ))}
      <PaginationBox
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
