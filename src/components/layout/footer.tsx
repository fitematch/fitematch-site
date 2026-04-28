import Link from 'next/link';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ROUTES } from '@/constants/routes';
import { FOOTER_STYLES, PAGE_STYLES } from '@/constants/styles';
import { THEME } from '@/constants/theme';

export function Footer() {
  return (
    <footer className={`border-t ${THEME.layout.border} ${THEME.layout.background}`}>
      <div className={`${PAGE_STYLES.container} grid gap-10 py-12 md:grid-cols-2`}>
        <div>
          <h2 className={FOOTER_STYLES.brand}>
            fitematch
          </h2>

          <p className={`mt-4 ${FOOTER_STYLES.text}`}>
            Você pode nos encontrar em alguns canais:
          </p>

          <div className="mt-4 flex items-center gap-4">
            <FaFacebook className={FOOTER_STYLES.socialFacebook} />
            <FaInstagram className={FOOTER_STYLES.socialInstagram} />
            <FaXTwitter className={FOOTER_STYLES.socialX} />
            <FaYoutube className={FOOTER_STYLES.socialYoutube} />
            <FaLinkedin className={FOOTER_STYLES.socialLinkedin} />
          </div>
        </div>

        <div className="md:text-right">
          <h3 className={FOOTER_STYLES.title}>
            Suporte & Ajuda
          </h3>

          <div className={`mt-4 flex flex-col gap-2 text-sm md:items-end ${THEME.footer.text}`}>
            <Link href={ROUTES.PRIVACY_POLICY} className={FOOTER_STYLES.link}>
              Política de Privacidade
            </Link>
            <Link href={ROUTES.TERMS_OF_USE} className={FOOTER_STYLES.link}>
              Termos de Uso
            </Link>
            <Link href={ROUTES.FAQ} className={FOOTER_STYLES.link}>
              FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className={`border-t ${THEME.layout.border} px-4 py-6 text-center ${FOOTER_STYLES.text}`}>
        <p>© 2026 fitematch - Todos os direitos reservados</p>
        <p className="mt-1">Desenvolvido por drowper</p>
      </div>
    </footer>
  );
}
