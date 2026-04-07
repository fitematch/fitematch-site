"use client";
import Link from "next/link";
import {
  CiFacebook,
  CiInstagram,
  CiLinkedin,
  CiYoutube,
} from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { useDictionary, useLocale } from "@/contexts/locale-context";
import { localizePath } from "@/i18n/config";

const currentYear = new Date(Date.now()).getFullYear();

const Footer = () => {
  const dictionary = useDictionary();
  const locale = useLocale();
  return (
    <footer className="relative z-10 bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link
                  href={localizePath("/", locale)}
                  className="mb-8 inline-block text-2xl font-bold tracking-tight text-gray-800 transition-colors hover:text-gray-600"
                >
                  fitematch
                </Link>
                <p className="mb-9 text-base leading-relaxed text-gray-600">
                  {locale === "pt"
                    ? "Você pode nos encontrar em alguns canais:"
                    : locale === "es"
                      ? "Puedes encontrarnos en algunos canales:"
                      : "You can find us on some channels:"}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href="/"
                    aria-label="facebook-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 duration-300 hover:text-gray-600"
                  >
                    <CiFacebook className="text-[28px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="instagram-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 duration-300 hover:text-gray-600"
                  >
                    <CiInstagram className="text-[28px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="x-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 duration-300 hover:text-gray-600"
                  >
                    <FaXTwitter className="text-[22px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="youtube-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 duration-300 hover:text-gray-600"
                  >
                    <CiYoutube className="text-[28px]" />
                  </a>
                  <a
                    href="/"
                    aria-label="linkedin-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 duration-300 hover:text-gray-600"
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
                <h2 className="mb-10 text-xl font-bold text-gray-800">
                  {dictionary.common.supportHelp}
                </h2>
                <ul>
                  <li>
                    <Link
                      href={localizePath("/privacy-policy", locale)}
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-gray-600"
                    >
                      {dictionary.common.privacyPolicy}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localizePath("/terms-of-use", locale)}
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-gray-600"
                    >
                      {dictionary.common.termsOfUse}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localizePath("/faq", locale)}
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-gray-600"
                    >
                      {dictionary.common.faq}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent"></div>
          <div className="py-8">
            <p className="text-center text-base text-gray-600">
              © {currentYear} fitematch - {dictionary.common.allRightsReserved}
            </p>
            <p className="text-center text-base text-gray-600">
              {dictionary.common.developedBy}{" "}
              <a
                href="http://drowper.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-gray-600"
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
