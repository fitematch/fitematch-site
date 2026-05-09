'use client';

import { useEffect, useState } from 'react';
import { CompanyStatusEnum } from '@/types/entities/company.entity';
import { JobStatusEnum } from '@/types/entities/job.entity';
import { UserStatusEnum } from '@/types/entities/user.entity';
import { CompanyService } from '@/services/company/company.service';
import { JobService } from '@/services/job/job.service';
import { UserService } from '@/services/user/user.service';

interface HomeHeroStat {
  label: string;
  value: string;
  meta: string;
}

interface UseHomeHeroStatsState {
  stats: HomeHeroStat[];
  isLoading: boolean;
}

function isWithinLast7Days(date?: string | Date): boolean {
  if (!date) {
    return false;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  return parsedDate.getTime() >= sevenDaysAgo;
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
        const [users, companies, jobs] = await Promise.all([
          UserService.list().catch(() => []),
          CompanyService.list().catch(() => []),
          JobService.list().catch(() => []),
        ]);

        if (!isMounted) {
          return;
        }

        const activeUsers = users.filter((user) => user.status !== UserStatusEnum.BANNED);
        const newUsersLast7Days = activeUsers.filter((user) =>
          isWithinLast7Days(user.createdAt),
        ).length;

        const activeCompanies = companies.filter(
          (company) => company.status === CompanyStatusEnum.ACTIVE,
        );
        const newCompaniesLast7Days = activeCompanies.filter((company) =>
          isWithinLast7Days(company.createdAt),
        ).length;

        const activeJobs = jobs.filter((job) => job.status === JobStatusEnum.ACTIVE);
        const newJobsLast7Days = activeJobs.filter((job) =>
          isWithinLast7Days(job.createdAt),
        ).length;

        setState({
          stats: [
            {
              label: 'USUÁRIOS CADASTRADOS',
              value: String(activeUsers.length),
              meta: newUsersLast7Days
                ? formatWeeklyMeta(newUsersLast7Days, 'novo', 'novos')
                : 'Sem novos na semana',
            },
            {
              label: 'EMPRESAS VERIFICADAS',
              value: String(activeCompanies.length),
              meta: newCompaniesLast7Days
                ? formatWeeklyMeta(newCompaniesLast7Days, 'nova', 'novas')
                : 'Sem novas na semana',
            },
            {
              label: 'VAGAS ATIVAS NO SITE',
              value: String(activeJobs.length),
              meta: newJobsLast7Days
                ? formatWeeklyMeta(newJobsLast7Days, 'nova', 'novas')
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
