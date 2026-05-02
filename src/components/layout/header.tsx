'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaUserPlus,
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { LanguageDropdown } from './language-dropdown';

export function Header() {

  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRecruiter = user?.productRole === ProductRoleEnum.RECRUITER;
  const isCandidate = user?.productRole === ProductRoleEnum.CANDIDATE;

  // Fecha o menu ao clicar em qualquer link
  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleSignOut() {
    try {
      await signOut();
      showSuccess('Logout realizado com sucesso.');
      router.push(ROUTES.HOME);
    } catch {
      showError('Não foi possível sair da conta.');
    }
  }

  return (
    <header className="border-b border-gray-800 bg-black px-0 py-4 md:px-0 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Esquerda: Logo e navegação */}
          <div className="flex items-center gap-6 min-w-0">
            <Link
              href={ROUTES.HOME}
              className={`text-2xl font-bold lowercase ${THEME.layout.header.logo} flex-shrink-0`}
            >
              fitematch
            </Link>
            {/* Navegação desktop */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link
                href={ROUTES.JOBS}
                className={`transition-colors hover:text-white ${pathname.startsWith(ROUTES.JOBS) ? THEME.navigation.linkActive : THEME.navigation.link}`}
              >
                Vagas
              </Link>
              {isCandidate && (
                <Link
                  href={ROUTES.APPLICATIONS}
                  className={`transition-colors hover:text-white ${pathname.startsWith(ROUTES.APPLICATIONS) ? THEME.navigation.linkActive : THEME.navigation.link}`}
                >
                  Aplicações
                </Link>
              )}
              {isRecruiter && (
                <Link
                  href={ROUTES.RECRUITER_COMPANY}
                  className={`transition-colors hover:text-white ${pathname.startsWith(ROUTES.RECRUITER_COMPANY) ? THEME.navigation.linkActive : THEME.navigation.link}`}
                >
                  Minha Empresa
                </Link>
              )}
              {isRecruiter && (
                <Link
                  href={ROUTES.RECRUITER_JOBS}
                  className={`transition-colors hover:text-white ${pathname.startsWith(ROUTES.RECRUITER_JOBS) ? THEME.navigation.linkActive : THEME.navigation.link}`}
                >
                  Minha(s) Vaga(s)
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href={ROUTES.SESSIONS}
                  className={`transition-colors hover:text-white ${pathname.startsWith(ROUTES.SESSIONS) ? THEME.navigation.linkActive : THEME.navigation.link}`}
                >
                  Sessions
                </Link>
              )}
              <Link
                href={ROUTES.FAQ}
                className={`transition-colors hover:text-white ${pathname.startsWith(ROUTES.FAQ) ? THEME.navigation.linkActive : THEME.navigation.link}`}
              >
                FAQ
              </Link>
            </nav>
          </div>
          {/* Direita: Dropdown de línguas e ações */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageDropdown />
            </div>
            <div className="hidden md:flex items-center gap-2">
              {!isLoading && isAuthenticated ? (
                <>
                  <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center justify-center gap-2 rounded border border-gray-500 bg-black px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  >
                    <FaUserCircle className="text-base" />
                    Perfil
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-medium text-red-100 hover:bg-red-500"
                  >
                    <FaSignOutAlt className="text-base" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.SIGN_UP}
                    className="flex items-center justify-center gap-2 rounded border border-blue-100 bg-blue-800 px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-600"
                  >
                    <FaUserPlus className="text-base" />
                    Cadastro
                  </Link>
                  <Link
                    href={ROUTES.SIGN_IN}
                    className="flex items-center justify-center gap-2 rounded border border-green-100 bg-green-800 px-3 py-2 text-sm font-medium text-green-100 hover:bg-green-600"
                  >
                    <FaSignInAlt className="text-base" />
                    Login
                  </Link>
                </>
              )}
            </div>
            {/* Botão menu mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded border border-gray-700 text-gray-300 md:hidden"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>
      {/* Menu mobile hamburger */}
      {menuOpen && (
        <div className="mt-4 space-y-3 border-t border-gray-800 pt-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <div className="w-full">
              <LanguageDropdown isFullWidth />
            </div>
            <Link
              href={ROUTES.JOBS}
              className={`flex w-full items-center justify-center rounded border border-gray-700 bg-black px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${pathname.startsWith(ROUTES.JOBS) ? 'font-bold' : ''}`}
              onClick={closeMenu}
            >
              Vagas
            </Link>
            {isCandidate && (
              <Link
                href={ROUTES.APPLICATIONS}
                className={`flex w-full items-center justify-center rounded border border-gray-700 bg-black px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${pathname.startsWith(ROUTES.APPLICATIONS) ? 'font-bold' : ''}`}
                onClick={closeMenu}
              >
                Aplicações
              </Link>
            )}
            {isRecruiter && (
              <Link
                href={ROUTES.RECRUITER_COMPANY}
                className={`flex w-full items-center justify-center rounded border border-gray-700 bg-black px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${pathname.startsWith(ROUTES.RECRUITER_COMPANY) ? 'font-bold' : ''}`}
                onClick={closeMenu}
              >
                Minha Empresa
              </Link>
            )}
            {isRecruiter && (
              <Link
                href={ROUTES.RECRUITER_JOBS}
                className={`flex w-full items-center justify-center rounded border border-gray-700 bg-black px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${pathname.startsWith(ROUTES.RECRUITER_JOBS) ? 'font-bold' : ''}`}
                onClick={closeMenu}
              >
                Minha(s) Vaga(s)
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href={ROUTES.SESSIONS}
                className={`flex w-full items-center justify-center rounded border border-gray-700 bg-black px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${pathname.startsWith(ROUTES.SESSIONS) ? 'font-bold' : ''}`}
                onClick={closeMenu}
              >
                Sessions
              </Link>
            )}
            <Link
              href={ROUTES.FAQ}
              className={`flex w-full items-center justify-center rounded border border-gray-700 bg-black px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${pathname.startsWith(ROUTES.FAQ) ? 'font-bold' : ''}`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
          </nav>
          <div className="flex flex-col gap-3">
            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  href={ROUTES.PROFILE}
                  className="flex w-full items-center justify-center gap-2 rounded border border-gray-500 bg-black px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  <FaUserCircle className="text-base" />
                  Perfil
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-medium text-red-100 hover:bg-red-500"
                >
                  <FaSignOutAlt className="text-base" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.SIGN_UP}
                  className="flex w-full items-center justify-center gap-2 rounded border border-blue-100 bg-blue-800 px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-600"
                  onClick={closeMenu}
                >
                  <FaUserPlus className="text-base" />
                  Cadastro
                </Link>
                <Link
                  href={ROUTES.SIGN_IN}
                  className="flex w-full items-center justify-center gap-2 rounded border border-green-100 bg-green-800 px-3 py-2 text-sm font-medium text-green-100 hover:bg-green-600"
                  onClick={closeMenu}
                >
                  <FaSignInAlt className="text-base" />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
