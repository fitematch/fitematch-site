'use client';

import { useEffect, useState } from 'react';
import { DashboardService } from '@/services/dashboard/dashboard.service';

interface HomeHeroStat {
  label: string;
  value: string;
  meta: string;
}

interface UseHomeHeroStatsState {
  stats: HomeHeroStat[];
  isLoading: boolean;
}

function formatWeeklyMeta(total: number, singular: string, plural: string): string {
  if (total === 1) {
    return `+ 1 ${singular} na semana`;
  }

  return `+ ${total} ${plural} na semana`;
}

const INITIAL_STATS: HomeHeroStat[] = [
  {
    label: 'USUÁRIOS CADASTRADOS',
    value: '0',
    meta: 'Carregando...',
  },
  {
    label: 'EMPRESAS VERIFICADAS',
    value: '0',
    meta: 'Carregando...',
  },
  {
    label: 'VAGAS ATIVAS NO SITE',
    value: '0',
    meta: 'Carregando...',
  },
  {
    label: 'APLICAÇÕES ATIVAS',
    value: '0',
    meta: 'Carregando...',
  },
];

export function useHomeHeroStats() {
  const [state, setState] = useState<UseHomeHeroStatsState>({
    stats: INITIAL_STATS,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const summary = await DashboardService.summary();

        if (!isMounted) {
          return;
        }

        setState({
          stats: [
            {
              label: 'USUÁRIOS CADASTRADOS',
              value: String(summary.users.total),
              meta: summary.users.lastWeek
                ? formatWeeklyMeta(summary.users.lastWeek, 'novo', 'novos')
                : 'Sem novos na semana',
            },
            {
              label: 'EMPRESAS VERIFICADAS',
              value: String(summary.companies.total),
              meta: summary.companies.lastWeek
                ? formatWeeklyMeta(summary.companies.lastWeek, 'nova', 'novas')
                : 'Sem novas na semana',
            },
            {
              label: 'VAGAS ATIVAS NO SITE',
              value: String(summary.jobs.total),
              meta: summary.jobs.lastWeek
                ? formatWeeklyMeta(summary.jobs.lastWeek, 'nova', 'novas')
                : 'Sem novas na semana',
            },
            {
              label: 'APLICAÇÕES ATIVAS',
              value: String(summary.applications.total),
              meta: summary.applications.lastWeek
                ? formatWeeklyMeta(summary.applications.lastWeek, 'nova', 'novas')
                : 'Sem novas na semana',
            },
          ],
          isLoading: false,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          stats: [
            {
              label: 'USUÁRIOS CADASTRADOS',
              value: '0',
              meta: 'Não foi possível carregar',
            },
            {
              label: 'EMPRESAS VERIFICADAS',
              value: '0',
              meta: 'Não foi possível carregar',
            },
            {
              label: 'VAGAS ATIVAS NO SITE',
              value: '0',
              meta: 'Não foi possível carregar',
            },
            {
              label: 'APLICAÇÕES ATIVAS',
              value: '0',
              meta: 'Não foi possível carregar',
            },
          ],
          isLoading: false,
        });
      }
    }

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
