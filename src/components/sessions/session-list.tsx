'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock3, MonitorSmartphone, ShieldCheck, ShieldX } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PaginationBox } from '@/components/ui/pagination-box';
import { Skeleton } from '@/components/ui/skeleton';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAuthSessions } from '@/hooks/use-auth-sessions';
import { getFriendlySessionDevice } from '@/utils/session-device';
import { SessionCard } from './session-card';

function SessionSummaryCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur transition-all duration-300 hover:border-lime-500/20 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.05),0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      </div>
      <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-zinc-50">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </motion.div>
  );
}

function formatDeviceCountLabel(value: number) {
  return value === 1 ? '1 dispositivo' : `${value} dispositivos`;
}

export function SessionList() {
  const { sessions, isLoading, error, revokeSession } = useAuthSessions();
  const { showSuccess, showError } = useFlashMessage();
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const activeSessions = useMemo(
    () => sessions.filter((session) => !session.revokedAt),
    [sessions],
  );
  const revokedSessions = sessions.length - activeSessions.length;
  const uniqueDevices = new Set(sessions.map((session) => session.userAgent || session.id)).size;

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paginatedSessions = sessions.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  async function handleRevoke(sessionId: string) {
    try {
      await revokeSession(sessionId);
      showSuccess('Sessão revogada com sucesso.');
    } catch {
      showError('Não foi possível revogar a sessão.');
    }
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-40 rounded-2xl border border-zinc-800 bg-zinc-950/80"
            />
          ))
        ) : (
          <>
            <SessionSummaryCard
              label="Ativas"
              value={activeSessions.length}
              helper="Sessões válidas no momento"
              icon={ShieldCheck}
            />
            <SessionSummaryCard
              label="Revogadas"
              value={revokedSessions}
              helper="Sessões encerradas manualmente"
              icon={ShieldX}
            />
            <SessionSummaryCard
              label="Dispositivos"
              value={uniqueDevices}
              helper={formatDeviceCountLabel(uniqueDevices)}
              icon={MonitorSmartphone}
            />
            <SessionSummaryCard
              label="Cobertura"
              value={`${sessions.length || 0}`}
              helper="Total de registros carregados"
              icon={Activity}
            />
          </>
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur"
      >
        <div className="flex flex-col gap-4 border-b border-zinc-800 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Dispositivos conectados</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-50">Sessões da conta</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-black/40 px-3 py-1.5 text-sm text-zinc-400">
            <Clock3 className="h-4 w-4 text-lime-400" />
            {isLoading ? 'Carregando sessões' : `${sessions.length} registros`}
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-56 rounded-2xl border border-zinc-800 bg-black/50"
              />
            ))}
          </div>
        )}

        {!isLoading && sessions.length === 0 && (
          <div className="p-6">
            <EmptyState message="Nenhuma sessão encontrada para sua conta." />
          </div>
        )}

        {!isLoading && sessions.length > 0 && (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-zinc-800 text-left">
                <thead className="bg-black/30">
                  <tr className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    <th className="px-6 py-4 font-medium">Dispositivo</th>
                    <th className="px-6 py-4 font-medium">IP</th>
                    <th className="px-6 py-4 font-medium">Criada em</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {paginatedSessions.map((session, index) => {
                    const isRevoked = Boolean(session.revokedAt);

                    return (
                      <tr key={session.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-zinc-100">
                              {getFriendlySessionDevice(session.userAgent) ||
                                `Dispositivo ${index + 1}`}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                              {session.expiresAt
                                ? `Expira em ${new Intl.DateTimeFormat('pt-BR', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                  }).format(new Date(session.expiresAt))}`
                                : 'Sem expiração informada'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-300">
                          {session.ipAddress || 'Não informado'}
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-500">
                          {session.createdAt
                            ? new Intl.DateTimeFormat('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }).format(new Date(session.createdAt))
                            : 'Sem registro'}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                              isRevoked
                                ? 'border-red-500/20 bg-red-500/10 text-red-200'
                                : 'border-lime-500/20 bg-lime-500/10 text-lime-300'
                            }`}
                          >
                            {isRevoked ? 'Revogada' : 'Ativa'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {!isRevoked ? (
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => handleRevoke(session.id)}
                              className="rounded-xl border-red-500/20 bg-red-500/10 px-4 py-2 text-red-200 hover:bg-red-500/15"
                            >
                              Revogar
                            </Button>
                          ) : (
                            <span className="text-sm text-zinc-600">Encerrada</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-6 lg:hidden">
              {paginatedSessions.map((session, index) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  index={index}
                  onRevoke={handleRevoke}
                />
              ))}
            </div>

            <div className="px-6 pb-6">
              <PaginationBox
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </motion.section>
    </div>
  );
}
