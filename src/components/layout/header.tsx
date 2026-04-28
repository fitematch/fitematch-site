'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaUserPlus,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { LanguageDropdown } from './language-dropdown';

export function Header() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signOut } = useAuth();
  const { showSuccess, showError } = useFlashMessage();

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
    <header className="sticky top-0 z-40 border-b border-gray-900 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href={ROUTES.HOME}
            className={`text-2xl font-bold lowercase ${THEME.text.logo}`}
          >
            fitematch
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href={ROUTES.JOBS} className={`text-sm ${THEME.text.menu}`}>
              Vagas
            </Link>

            <Link href={ROUTES.FAQ} className={`text-sm ${THEME.text.menu}`}>
              FAQ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageDropdown />

          {!isLoading && !isAuthenticated && (
            <>
              <Link href={ROUTES.SIGN_UP}>
                <Button variant="positive" icon={<FaUserPlus />}>
                  Cadastre-se
                </Button>
              </Link>

              <Link href={ROUTES.SIGN_IN}>
                <Button variant="login" icon={<FaSignInAlt />}>
                  Entrar
                </Button>
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <>
              <Link href={ROUTES.PROFILE}>
                <Button variant="profile" icon={<FaUserCircle />}>
                  Profile
                </Button>
              </Link>

              <Button
                type="button"
                variant="danger"
                icon={<FaSignOutAlt />}
                onClick={handleSignOut}
              >
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}