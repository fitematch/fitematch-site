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
      <style jsx>{`
        .hero-dumbbell-bench {
          transform-box: fill-box;
          transform-origin: center;
          animation: hero-dumbbell-bench-press 2.2s ease-in-out infinite;
        }

        @keyframes hero-dumbbell-bench-press {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-26px);
          }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-100 md:text-7xl">
            Onde o fitness encontra performance.
          </h1>

          <p className="mt-5 max-w-2xl text-[0.78rem] font-bold uppercase tracking-[0.28em] text-gray-200 sm:text-[0.9rem]">
            <span className="text-lime-400">Fit</span>
            <span className="text-gray-200"> de profissionais. </span>
            <span className="text-lime-400">Match</span>
            <span className="text-gray-200"> de resultados.</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={isAuthenticated ? ROUTES.APPLICATIONS : ROUTES.SIGN_UP}>
              <Button color="green" icon={isAuthenticated ? <FaCheckCircle /> : <FaUserPlus />}>
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
            <svg viewBox="0 0 420 420" className="h-[360px] w-[360px]" aria-hidden="true">
              <defs>
                <radialGradient id="heroCircleGlow" cx="50%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="#A3E635" stopOpacity="0.34" />
                  <stop offset="55%" stopColor="#84CC16" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#050505" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heroHeartFill" cx="50%" cy="30%" r="78%">
                  <stop offset="0%" stopColor="#C7F51D" />
                  <stop offset="58%" stopColor="#84CC16" />
                  <stop offset="100%" stopColor="#65A30D" />
                </radialGradient>

                <linearGradient id="heroHeartInnerStroke" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#F5F5F5" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.08" />
                </linearGradient>

                <linearGradient id="heroDumbbellBar" x1="0%" x2="100%" y1="50%" y2="50%">
                  <stop offset="0%" stopColor="#0B0B0B" />
                  <stop offset="50%" stopColor="#1A1A1A" />
                  <stop offset="100%" stopColor="#050505" />
                </linearGradient>

                <linearGradient id="heroDumbbellPlate" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#F5F5F5" />
                  <stop offset="100%" stopColor="#C7F51D" />
                </linearGradient>

                <filter id="heroLimeGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="12" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0.639
                            0 0 0 0 0.902
                            0 0 0 0 0.208
                            0 0 0 0.75 0"
                  />
                </filter>

                <filter id="heroHeartGlow" x="-35%" y="-35%" width="170%" height="170%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="10"
                    floodColor="#A3E635"
                    floodOpacity="0.28"
                  />
                </filter>
              </defs>

              <circle
                cx="210"
                cy="210"
                r="170"
                fill="url(#heroCircleGlow)"
                stroke="#A3E635"
                strokeOpacity="0.28"
                strokeWidth="2"
              />

              <circle
                cx="210"
                cy="210"
                r="132"
                fill="none"
                stroke="#C7F51D"
                strokeOpacity="0.42"
                strokeWidth="1.5"
                strokeDasharray="6 10"
              />

              <circle
                cx="210"
                cy="210"
                r="148"
                fill="none"
                stroke="#A3E635"
                strokeOpacity="0.16"
                strokeWidth="20"
                filter="url(#heroLimeGlow)"
              />

              <g transform="translate(210 210)">
                <path
                  d="M0 84c-10-8-18-15-25-21-42-36-69-58-69-96 0-28 21-49 48-49 16 0 32 8 46 23 14-15 30-23 46-23 27 0 48 21 48 49 0 38-27 60-69 96-7 6-15 13-25 21Z"
                  fill="url(#heroHeartFill)"
                  stroke="#C7F51D"
                  strokeWidth="4"
                  filter="url(#heroHeartGlow)"
                  transform="translate(-52 -66) scale(1.03)"
                />

                <path
                  d="M0 84c-10-8-18-15-25-21-42-36-69-58-69-96 0-28 21-49 48-49 16 0 32 8 46 23 14-15 30-23 46-23 27 0 48 21 48 49 0 38-27 60-69 96-7 6-15 13-25 21Z"
                  fill="none"
                  stroke="url(#heroHeartInnerStroke)"
                  strokeWidth="1.6"
                  strokeOpacity="0.9"
                  transform="translate(-52 -66) scale(0.93)"
                />

                <g className="hero-dumbbell-bench" transform="rotate(-28)">
                  <rect
                    x="-86"
                    y="-9"
                    width="172"
                    height="18"
                    rx="9"
                    fill="url(#heroDumbbellBar)"
                    stroke="#84CC16"
                    strokeOpacity="0.65"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="-118"
                    y="-26"
                    width="18"
                    height="52"
                    rx="6"
                    fill="url(#heroDumbbellPlate)"
                  />
                  <rect x="-96" y="-34" width="12" height="68" rx="5" fill="#84CC16" />
                  <rect
                    x="-74"
                    y="-26"
                    width="18"
                    height="52"
                    rx="6"
                    fill="url(#heroDumbbellPlate)"
                  />
                  <rect
                    x="56"
                    y="-26"
                    width="18"
                    height="52"
                    rx="6"
                    fill="url(#heroDumbbellPlate)"
                  />
                  <rect x="84" y="-34" width="12" height="68" rx="5" fill="#84CC16" />
                  <rect
                    x="100"
                    y="-26"
                    width="18"
                    height="52"
                    rx="6"
                    fill="url(#heroDumbbellPlate)"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
