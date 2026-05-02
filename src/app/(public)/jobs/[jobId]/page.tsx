'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaWhatsapp, FaFacebook, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlinePlace } from 'react-icons/md';
import { SlGlobe } from 'react-icons/sl';
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
              <div className={CARD_STYLES.jobCard}>
                <div className="flex items-center gap-4 mb-4">
                  {company.media?.logoUrl ? (
                    <Image
                      src={company.media.logoUrl}
                      alt={company.tradeName}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-lg border border-gray-800 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-800 bg-gray-950 text-lg font-semibold text-gray-300">
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
                    className="flex items-center gap-2 text-xs text-gray-400 hover:underline mb-2"
                  >
                    <SlGlobe className="text-base" />
                    {company.contacts.website}
                  </a>
                )}

                {company.contacts?.address && (
                  <div className="text-xs text-gray-400 space-y-1 mb-2">
                    {(company.contacts.address.street || company.contacts.address.number) && (
                      <div className="flex items-center gap-2">
                        <MdOutlinePlace className="text-gray-400" />
                        <span>
                          {company.contacts.address.street || ''}
                          {company.contacts.address.number ? `, ${company.contacts.address.number}` : ''}
                          {company.contacts.address.complement ? ` - ${company.contacts.address.complement}` : ''}
                          {company.contacts.address.neighborhood ? ` - ${company.contacts.address.neighborhood}` : ''}
                          {company.contacts.address.city ? ` - ${company.contacts.address.city}` : ''}
                          {company.contacts.address.state ? ` / ${company.contacts.address.state}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Mapa dentro do card */}
                {company.contacts?.address && (
                  (() => {
                    const addr = company.contacts.address;
                    const addressParts = [
                      addr.street,
                      addr.number,
                      addr.neighborhood,
                      addr.complement,
                      addr.city,
                      addr.state
                    ].filter(Boolean);
                    const fullAddress = addressParts.join(', ');
                    const mapQuery = fullAddress || [addr.city, addr.state].filter(Boolean).join(', ');
                    return (addr.city && addr.state) ? (
                      <div className="mt-4">
                        <iframe
                          title="Mapa da empresa"
                          width="100%"
                          height="180"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                        ></iframe>
                      </div>
                    ) : null;
                  })()
                )}
              </div>
            )}
            {/* Compartilhamento */}
            <div className={CARD_STYLES.jobCard}>
              <div className="font-bold text-gray-100 text-lg mb-2">Compartilhar</div>
              <div className="flex gap-3 items-center">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  title="WhatsApp"
                  style={{ lineHeight: 0 }}
                >
                  <FaWhatsapp size={22} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-md bg-black text-white hover:bg-gray-800 border border-gray-700"
                  title="X (Twitter)"
                  style={{ lineHeight: 0 }}
                >
                  <FaXTwitter size={22} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-md bg-blue-700 text-white hover:bg-blue-800"
                  title="Facebook"
                  style={{ lineHeight: 0 }}
                >
                  <FaFacebook size={22} style={{ verticalAlign: 'middle' }} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-md bg-blue-900 text-white hover:bg-blue-950"
                  title="LinkedIn"
                  style={{ lineHeight: 0 }}
                >
                  <FaLinkedinIn size={22} style={{ verticalAlign: 'middle' }} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
