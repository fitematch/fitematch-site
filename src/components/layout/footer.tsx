import Link from 'next/link';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ROUTES } from '@/constants/routes';
import { THEME } from '@/constants/theme';

export function Footer() {
  return (
    <footer className={`border-t ${THEME.layout.border} ${THEME.layout.background}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold lowercase text-gray-700">
            fitematch
          </h2>

          <p className="mt-4 text-sm text-gray-700">
            Você pode nos encontrar em alguns canais:
          </p>

          <div className="mt-4 flex items-center gap-4 text-gray-700">
            <FaFacebook />
            <FaInstagram />
            <FaXTwitter />
            <FaYoutube />
            <FaLinkedin />
          </div>
        </div>

        <div className="md:text-right">
          <h3 className="text-lg font-semibold text-gray-700">
            Suporte & Ajuda
          </h3>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700 md:items-end">
            <Link href="#" className="hover:text-gray-500">
              Política de Privacidade
            </Link>
            <Link href="#" className="hover:text-gray-500">
              Termos de Uso
            </Link>
            <Link href={ROUTES.FAQ} className="hover:text-gray-500">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className={`border-t ${THEME.layout.border} px-4 py-6 text-center text-sm text-gray-700`}>
        <p>© 2026 fitematch - Todos os direitos reservados</p>
        <p className="mt-1">Desenvolvido por drowper</p>
      </div>
    </footer>
  );
}
