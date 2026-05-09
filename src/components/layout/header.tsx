'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, LogIn, LogOut, Menu, UserRound, UserRoundPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { useAuth } from '@/hooks/use-auth';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { LanguageDropdown } from './language-dropdown';

const NAV_LINK_BASE =
  'rounded-full px-3 py-2 text-sm text-zinc-50 transition-colors duration-200 hover:text-lime-500';
const NAV_LINK_ACTIVE = 'text-lime-400';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { showError, showSuccess } = useFlashMessage();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isRecruiter = user?.productRole === ProductRoleEnum.RECRUITER;
  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { href: ROUTES.JOBS, label: 'Vagas', show: true },
    { href: ROUTES.APPLICATIONS, label: 'Aplicações', show: isCandidate },
    { href: ROUTES.RECRUITER_COMPANY, label: 'Minha Empresa', show: isRecruiter },
    { href: ROUTES.RECRUITER_JOBS, label: 'Minhas Vagas', show: isRecruiter },
    { href: ROUTES.SESSIONS, label: 'Sessões', show: isAuthenticated },
    { href: ROUTES.FAQ, label: 'FAQ', show: true },
  ].filter((item) => item.show);

  async function handleSignOut() {
    try {
      await signOut();
      showSuccess('Logout realizado com sucesso.');
      setMenuOpen(false);
      router.push(ROUTES.HOME);
    } catch {
      showError('Não foi possível sair da conta.');
    }
  }

  function getNavClass(href: string) {
    const isActive = pathname.startsWith(href) && href !== ROUTES.HOME;
    return `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : ''}`;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/8 bg-black/55 backdrop-blur-xl'
          : 'border-b border-white/8 bg-zinc-950/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href={ROUTES.HOME}
            className="text-lg font-semibold lowercase tracking-[-0.05em] text-zinc-50 transition-opacity hover:opacity-80"
          >
            <span className="text-zinc-50">fite</span>
            <span className="text-lime-400">match</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={getNavClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageDropdown />

          {!isLoading && !isAuthenticated && (
            <>
              <Link
                href={ROUTES.SIGN_IN}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-white"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
              <Link
                href={ROUTES.SIGN_UP}
                className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-lime-400"
              >
                Criar conta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <>
              <Link
                href={ROUTES.PROFILE}
                className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-sm text-lime-300 transition-all duration-300 hover:border-lime-500/35 hover:bg-lime-500/15 hover:text-lime-200"
              >
                <UserRound className="h-4 w-4" />
                Perfil
              </Link>
              <button
                type="button"
                onClick={() => {
                  void handleSignOut();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/15 hover:text-red-100"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-100 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] lg:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="border-t border-white/8 bg-black/80 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
              <div className="flex justify-end">
                <LanguageDropdown />
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-lime-500/10 hover:text-lime-400 ${
                      pathname.startsWith(item.href) && item.href !== ROUTES.HOME
                        ? 'text-lime-400'
                        : 'text-zinc-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {!isLoading && !isAuthenticated && (
                <div className="grid gap-2 pt-2">
                  <Link
                    href={ROUTES.SIGN_IN}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                  <Link
                    href={ROUTES.SIGN_UP}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-500 px-4 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-lime-400"
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    Criar conta
                  </Link>
                </div>
              )}

              {!isLoading && isAuthenticated && (
                <div className="grid gap-2 pt-2">
                  <Link
                    href={ROUTES.PROFILE}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-lime-500/20 bg-lime-500/10 px-4 py-3 text-sm text-lime-300 transition-all duration-300 hover:border-lime-500/35 hover:bg-lime-500/15 hover:text-lime-200"
                  >
                    <UserRound className="h-4 w-4" />
                    Perfil
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void handleSignOut();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/15 hover:text-red-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
