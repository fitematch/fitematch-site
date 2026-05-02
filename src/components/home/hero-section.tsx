'use client';

import Link from 'next/link';
import { FaBriefcase, FaCheckCircle, FaUserPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className={`flex min-h-screen items-center ${THEME.layout.background}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-100 md:text-7xl">
            Conecte talentos fitness às melhores academias.
          </h1>

          <p className={`mt-6 max-w-2xl text-lg ${THEME.text.body}`}>
            Encontre vagas para profissionais de educação física ou publique
            oportunidades para contratar candidatos qualificados.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={isAuthenticated ? ROUTES.APPLICATIONS : ROUTES.SIGN_UP}>
              <Button
                color="green"
                icon={isAuthenticated ? <FaCheckCircle /> : <FaUserPlus />}
              >
                {isAuthenticated ? 'Ver candidaturas' : 'Quero me cadastrar'}
              </Button>
            </Link>

            <Link href={ROUTES.JOBS}>
              <Button variant="login" icon={<FaBriefcase />}>
                Ver vagas
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <div className="flex h-[420px] w-[420px] items-center justify-center rounded-full border border-gray-800 bg-gray-900/70 shadow-2xl shadow-gray-950/80">
            <svg
              viewBox="0 0 420 420"
              className="h-[360px] w-[360px]"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="heroCircleGlow" cx="50%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.2" />
                  <stop offset="65%" stopColor="#d1d5db" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.03" />
                </radialGradient>
              </defs>

              <circle
                cx="210"
                cy="210"
                r="170"
                fill="url(#heroCircleGlow)"
                stroke="#6b7280"
                strokeOpacity="0.35"
                strokeWidth="2"
              />

              <circle
                cx="210"
                cy="210"
                r="132"
                fill="none"
                stroke="#9ca3af"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeDasharray="6 10"
              />

              <g transform="translate(210 210)">
                <path
                  d="M0 84c-10-8-18-15-25-21-42-36-69-58-69-96 0-28 21-49 48-49 16 0 32 8 46 23 14-15 30-23 46-23 27 0 48 21 48 49 0 38-27 60-69 96-7 6-15 13-25 21Z"
                  fill="#f3f4f6"
                  fillOpacity="0.92"
                  transform="translate(-52 -66) scale(1.03)"
                />

                <g transform="rotate(-28)">
                  <rect
                    x="-86"
                    y="-9"
                    width="172"
                    height="18"
                    rx="9"
                    fill="#111827"
                  />
                  <rect x="-118" y="-26" width="18" height="52" rx="6" fill="#f3f4f6" />
                  <rect x="-96" y="-34" width="12" height="68" rx="5" fill="#d1d5db" />
                  <rect x="-74" y="-26" width="18" height="52" rx="6" fill="#f3f4f6" />
                  <rect x="56" y="-26" width="18" height="52" rx="6" fill="#f3f4f6" />
                  <rect x="84" y="-34" width="12" height="68" rx="5" fill="#d1d5db" />
                  <rect x="100" y="-26" width="18" height="52" rx="6" fill="#f3f4f6" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
