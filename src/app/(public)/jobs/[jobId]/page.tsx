'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaWhatsapp, FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlinePlace } from 'react-icons/md';
import { SlGlobe } from 'react-icons/sl';
import { CiShare2 } from 'react-icons/ci';
import { FaXTwitter } from 'react-icons/fa6';
import { useJob } from '@/hooks/use-job';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { useApplications } from '@/hooks/use-applications';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { ApplyJobButton } from '@/components/jobs/apply-job-button';
import { THEME } from '@/constants/theme';
import { JobCard } from '@/components/jobs/job-card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CARD_STYLES, TEXT_STYLES } from '@/constants/styles';
import { JobLocationMapTest } from '@/components/jobs/job-location-map-test';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const { applications } = useApplications();

  const hasAlreadyApplied = applications.some(
    (app) => app.jobId === jobId,
  );

  const { job, isLoading, error } = useJob(jobId);
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = usePublicCompanies();

  const company = job?.company
    ? {
        ...job.company,
        _id: job.company._id || job.company._id,
      }
    : (job && companies.find((item) => item._id === job.companyId))
      ? companies.find((item) => item._id === job.companyId)
      : undefined;

  if (isLoading || isLoadingCompanies) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (companiesError) {
    return <Alert type="error" message={companiesError} />;
  }

  if (!job) {
    return null;
  }

  return (
    <section className={`min-h-screen ${THEME.layout.background} py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Vagas', href: ROUTES.JOBS },
            { label: job.title },
          ]}
        />
        <h1 className={`${TEXT_STYLES.pageTitle} mt-8`}>
          {company?.tradeName ? `${company.tradeName} - ${job.title}` : job.title}
        </h1>
        {/* Data de publicação */}
        <div className={`${TEXT_STYLES.pageSubtitle} mt-2 mb-2 text-gray-400`}>{job.createdAt && `Publicado: ${new Date(job.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })} às ${new Date(job.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}</div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            <JobCard
              job={job}
              company={company}
              showRequirements={true}
              hideDetailsButton={true}
              hideImageTitleAndLocation={true}
              className="border-slate-600/70 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.34),0_0_0_1px_rgba(148,163,184,0.06)]"
              customActions={
                <>
                  <Link href={ROUTES.JOBS}>
                    <Button color="gray" icon={<FaArrowLeft />}>
                      Vagas
                    </Button>
                  </Link>
                  <ApplyJobButton jobId={job._id} hasAlreadyApplied={hasAlreadyApplied} />
                </>
              }
            />
          </div>
          <aside className="space-y-8">
            {/* Sobre a empresa (com mapa) */}
            {company && (
              <div className={`${CARD_STYLES.jobCard} border-slate-700/70 bg-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.26)]`}>
                <div className="mb-5 flex items-center gap-4">
                  {company.media?.logoUrl ? (
                    <Image
                      src={company.media.logoUrl}
                      alt={company.tradeName}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-xl border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-black text-lg font-semibold text-gray-300">
                      {company.tradeName?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-100 text-lg">{company.tradeName}</div>
                  </div>
                </div>
                {company.contacts?.website && (
                  <a
                    href={company.contacts.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-black/60 px-3 py-3 text-sm text-gray-300 transition-colors hover:border-slate-500 hover:text-gray-100"
                  >
                    <SlGlobe className="text-base" />
                    {company.contacts.website}
                  </a>
                )}
              </div>
            )}
            {company && <JobLocationMapTest company={company} />}
            {/* Compartilhamento */}
            <div className={`${CARD_STYLES.jobCard} border-slate-700/70 bg-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.26)]`}>
              <div className="mb-5 flex items-center gap-3 text-lg font-bold text-gray-100">
                <CiShare2 className="h-6 w-6" />
                <span>Compartilhar</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-zinc-900 text-green-300 transition-all hover:-translate-y-0.5 hover:border-green-500 hover:bg-green-600 hover:text-white"
                  title="WhatsApp"
                  style={{ lineHeight: 0 }}
                >
                  <FaWhatsapp size={26} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-zinc-900 text-gray-300 transition-all hover:-translate-y-0.5 hover:border-white/70 hover:bg-black hover:text-white"
                  title="X (Twitter)"
                  style={{ lineHeight: 0 }}
                >
                  <FaXTwitter size={26} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-zinc-900 text-blue-300 transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-700 hover:text-white"
                  title="Facebook"
                  style={{ lineHeight: 0 }}
                >
                  <FaFacebook size={26} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-zinc-900 text-pink-300 transition-all hover:-translate-y-0.5 hover:border-pink-500 hover:bg-gradient-to-br hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-white"
                  title="Instagram"
                  style={{ lineHeight: 0 }}
                >
                  <FaInstagram size={26} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-zinc-900 text-sky-300 transition-all hover:-translate-y-0.5 hover:border-sky-500 hover:bg-sky-800 hover:text-white"
                  title="LinkedIn"
                  style={{ lineHeight: 0 }}
                >
                  <FaLinkedinIn size={26} style={{ verticalAlign: 'middle' }} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
