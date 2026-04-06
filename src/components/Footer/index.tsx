"use client";
import Link from "next/link";
import {
  CiFacebook,
  CiInstagram,
  CiLinkedin,
  CiYoutube,
} from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";

const currentYear = new Date(Date.now()).getFullYear();

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link
                  href="/"
                  className="mb-8 inline-block text-2xl font-bold tracking-tight text-black transition-colors hover:text-gray-900"
                >
                  fitematch
                </Link>
                <p className="mb-9 text-base leading-relaxed text-body-color">
                  Você pode nos encontrar em alguns canais:
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href="/"
                    aria-label="facebook-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color duration-300 hover:text-blue-700"
                  >
                    <CiFacebook className="text-[28px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="instagram-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color duration-300 hover:text-purple-700"
                  >
                    <CiInstagram className="text-[28px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="x-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color duration-300 hover:text-black"
                  >
                    <FaXTwitter className="text-[22px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="youtube-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color duration-300 hover:text-red-700"
                  >
                    <CiYoutube className="text-[28px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="linkedin-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color duration-300 hover:text-blue-700"
                  >
                    <CiLinkedin className="text-[28px]" />
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            </div>

            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black">
                  Suporte & Ajuda
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary"
                    >
                      Política de Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-of-use"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary"
                    >
                      Termos de Uso
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent"></div>
          <div className="py-8">
            <p className="text-center text-base text-body-color">
              © {currentYear} fitematch - Todos os direitos reservados
            </p>
            <p className="text-center text-base text-body-color">
              Desenvolvido por{" "}
              <a
                href="http://drowper.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                drowper
              </a>
            </p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
