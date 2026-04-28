import Link from 'next/link';
import { FaBriefcase, FaUserPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { THEME } from '@/constants/theme';

export function HeroSection() {
  return (
    <section className={`flex min-h-screen items-center ${THEME.layout.background}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <h1 className={`text-5xl font-bold ${THEME.text.title} md:text-7xl`}>
            Conecte talentos fitness às melhores academias.
          </h1>

          <p className={`mt-6 max-w-2xl text-lg ${THEME.text.body}`}>
            Encontre vagas para profissionais de educação física ou publique
            oportunidades para contratar candidatos qualificados.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={ROUTES.SIGN_UP}>
              <Button color="green" icon={<FaUserPlus />}>
                Quero me cadastrar
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
          <div className="h-[420px] w-[420px] rounded-full border border-gray-900 bg-gray-950 shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
