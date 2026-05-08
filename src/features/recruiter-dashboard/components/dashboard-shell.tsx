'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';

const NAV_ITEMS = [
  { href: ROUTES.RECRUITER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.RECRUITER_JOBS, label: 'Vagas', icon: BriefcaseBusiness },
  { href: ROUTES.RECRUITER_COMPANY, label: 'Empresa', icon: Building2 },
];

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
        <Link
          href={ROUTES.RECRUITER_DASHBOARD}
          className="inline-flex items-center gap-3 lowercase"
          onClick={onNavigate}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
            <BarChart3 className="h-4 w-4" />
          </span>
          {!collapsed && (
            <span className="text-base font-semibold tracking-[-0.04em] text-zinc-50">
              <span className="text-zinc-50">fite</span>
              <span className="text-lime-400">match</span>
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 backdrop-blur">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === ROUTES.RECRUITER_DASHBOARD
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 last:mb-0 ${
                  isActive
                    ? 'bg-lime-500/10 text-lime-300'
                    : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {!collapsed && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Snapshot
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Hiring cadence</span>
                <span className="text-lime-400">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pipeline quality</span>
                <span className="text-zinc-200">92%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <div className="flex min-h-screen">
        <aside
          className={`hidden border-r border-zinc-800 bg-zinc-950/70 backdrop-blur xl:block ${
            collapsed ? 'w-24' : 'w-72'
          } transition-all duration-300`}
        >
          <SidebarContent collapsed={collapsed} />
        </aside>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 xl:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -24, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur xl:hidden"
              >
                <div className="flex items-center justify-end p-3">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/70 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 xl:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCollapsed((current) => !current)}
                  className="hidden h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 xl:inline-flex"
                >
                  <ChevronLeft
                    className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                  />
                </button>

                <div>
                  <p className="text-sm text-zinc-500">{subtitle}</p>
                  <h1 className="text-lg font-semibold tracking-[-0.04em] text-zinc-50">{title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-500 md:flex">
                  <Search className="h-4 w-4" />
                  Buscar vaga, aplicação ou candidato
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-lime-500/10 text-lime-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
