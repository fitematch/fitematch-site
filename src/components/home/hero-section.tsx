'use client';

import Link from 'next/link';
import { FaBriefcase, FaCheckCircle, FaUserPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  function renderHeroVisual(variant: 'mobile' | 'desktop') {
    const circleGlowId = `heroCircleGlow-${variant}`;
    const heartFillId = `heroHeartFill-${variant}`;
    const heartInnerStrokeId = `heroHeartInnerStroke-${variant}`;
    const dumbbellBarId = `heroDumbbellBar-${variant}`;
    const dumbbellPlateId = `heroDumbbellPlate-${variant}`;
    const limeGlowId = `heroLimeGlow-${variant}`;
    const heartGlowId = `heroHeartGlow-${variant}`;

    return (
      <div className="hero-orb-shell flex h-[260px] w-[260px] items-center justify-center rounded-full border border-lime-300/20 bg-lime-950/20 shadow-2xl shadow-lime-950/20 sm:h-[320px] sm:w-[320px] lg:h-[420px] lg:w-[420px]">
        <svg
          viewBox="0 0 420 420"
          className="h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] lg:h-[360px] lg:w-[360px]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={circleGlowId} cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.34" />
              <stop offset="55%" stopColor="#84CC16" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#050505" stopOpacity="0" />
            </radialGradient>

            <radialGradient id={heartFillId} cx="50%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#C7F51D" />
              <stop offset="58%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#65A30D" />
            </radialGradient>

            <linearGradient id={heartInnerStrokeId} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#F5F5F5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id={dumbbellBarId} x1="0%" x2="100%" y1="50%" y2="50%">
              <stop offset="0%" stopColor="#0B0B0B" />
              <stop offset="50%" stopColor="#1A1A1A" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            <linearGradient id={dumbbellPlateId} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#F5F5F5" />
              <stop offset="100%" stopColor="#C7F51D" />
            </linearGradient>

            <filter id={limeGlowId} x="-40%" y="-40%" width="180%" height="180%">
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

            <filter id={heartGlowId} x="-35%" y="-35%" width="170%" height="170%">
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
            fill={`url(#${circleGlowId})`}
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
            className="hero-outer-ring"
            cx="210"
            cy="210"
            r="148"
            fill="none"
            stroke="#F7FEE7"
            strokeOpacity="0.42"
            strokeWidth="14"
            filter={`url(#${limeGlowId})`}
          />

          <g transform="translate(215 226)">
            <path
              d="M0 84c-10-8-18-15-25-21-42-36-69-58-69-96 0-28 21-49 48-49 16 0 32 8 46 23 14-15 30-23 46-23 27 0 48 21 48 49 0 38-27 60-69 96-7 6-15 13-25 21Z"
              fill={`url(#${heartFillId})`}
              stroke="#C7F51D"
              strokeWidth="4"
              filter={`url(#${heartGlowId})`}
              transform="translate(-5 -10) scale(1.03)"
            />

            <path
              d="M0 84c-10-8-18-15-25-21-42-36-69-58-69-96 0-28 21-49 48-49 16 0 32 8 46 23 14-15 30-23 46-23 27 0 48 21 48 49 0 38-27 60-69 96-7 6-15 13-25 21Z"
              fill="none"
              stroke={`url(#${heartInnerStrokeId})`}
              strokeWidth="1.6"
              strokeOpacity="0.9"
              transform="translate(-5 -10) scale(0.93)"
            />

            <g transform="translate(0 12)">
              <g className="hero-dumbbell-bench">
                <g transform="translate(-78 34) rotate(-28)">
                  <rect
                    x="-43"
                    y="-6"
                    width="86"
                    height="12"
                    rx="6"
                    fill={`url(#${dumbbellBarId})`}
                    stroke="#84CC16"
                    strokeOpacity="0.65"
                    strokeWidth="1.25"
                  />
                  <rect
                    x="-60"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                  <rect x="-46" y="-24" width="8" height="48" rx="4" fill="#84CC16" />
                  <rect
                    x="-34"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                  <rect
                    x="22"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                  <rect x="38" y="-24" width="8" height="48" rx="4" fill="#84CC16" />
                  <rect
                    x="48"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                </g>

                <g transform="translate(78 34) rotate(28)">
                  <rect
                    x="-43"
                    y="-6"
                    width="86"
                    height="12"
                    rx="6"
                    fill={`url(#${dumbbellBarId})`}
                    stroke="#84CC16"
                    strokeOpacity="0.65"
                    strokeWidth="1.25"
                  />
                  <rect
                    x="-60"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                  <rect x="-46" y="-24" width="8" height="48" rx="4" fill="#84CC16" />
                  <rect
                    x="-34"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                  <rect
                    x="22"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                  <rect x="38" y="-24" width="8" height="48" rx="4" fill="#84CC16" />
                  <rect
                    x="48"
                    y="-18"
                    width="12"
                    height="36"
                    rx="4"
                    fill={`url(#${dumbbellPlateId})`}
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <section className={`flex min-h-screen items-center ${THEME.layout.background}`}>
      <style jsx global>{`
        .hero-dumbbell-bench {
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform;
          transform: translateY(0);
          animation: hero-dumbbell-bench-press 5s ease-in-out infinite;
        }

        .hero-outer-ring {
          animation: hero-outer-ring-pulse 5s ease-in-out infinite;
        }

        .hero-orb-shell {
          animation: hero-orb-shell-pulse 5s ease-in-out infinite;
        }

        @keyframes hero-dumbbell-bench-press {
          0%,
          20% {
            transform: translateY(0);
          }

          40%,
          80% {
            transform: translateY(-16px);
          }

          100% {
            transform: translateY(0);
          }
        }

        @keyframes hero-outer-ring-pulse {
          0%,
          20% {
            stroke: #f7fee7;
            stroke-opacity: 0.42;
            stroke-width: 14;
          }

          40%,
          80% {
            stroke: #fbfef0;
            stroke-opacity: 0.5;
            stroke-width: 13.25;
          }

          100% {
            stroke: #f7fee7;
            stroke-opacity: 0.42;
            stroke-width: 14;
          }
        }

        @keyframes hero-orb-shell-pulse {
          0%,
          20% {
            background-color: rgb(54 83 20 / 0.16);
            border-color: rgb(190 242 100 / 0.18);
            box-shadow: 0 24px 48px rgb(5 5 5 / 0.32);
          }

          40%,
          80% {
            background-color: rgb(74 116 22 / 0.18);
            border-color: rgb(190 242 100 / 0.215);
            box-shadow:
              0 24px 48px rgb(163 230 53 / 0.035),
              0 0 18px rgb(190 242 100 / 0.05);
          }

          100% {
            background-color: rgb(54 83 20 / 0.16);
            border-color: rgb(190 242 100 / 0.18);
            box-shadow: 0 24px 48px rgb(5 5 5 / 0.32);
          }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-8 flex justify-center lg:hidden">{renderHeroVisual('mobile')}</div>

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
          {renderHeroVisual('desktop')}
        </div>
      </div>
    </section>
  );
}
