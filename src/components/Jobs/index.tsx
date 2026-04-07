import { getAllJobs } from "@/api/job.api";
import { getAllApplies } from "@/api/apply.api";
import { getCurrentLocale } from "@/i18n/server";
import { localizePath } from "@/i18n/config";
import Link from "next/link";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";

import FeaturedJobsMarquee from "./FeaturedJobsMarquee";
import JobsSearchForm from "./JobsSearchForm";

const Jobs = async ({
  currentPage = 1,
  showRegularJobs = true,
}: {
  currentPage?: number;
  showRegularJobs?: boolean;
}) => {
  const locale = await getCurrentLocale();
  const { jobs, pagination } = await getAllJobs({
    page: currentPage,
    limit: 6,
  });
  const applies = await getAllApplies();
  const appliedJobIds = Array.from(new Set(
    applies
      .map((apply) => apply.jobId)
      .filter((jobId): jobId is string => Boolean(jobId)),
  ));
  const activeJobs = jobs.filter((job) => job.status === "active");
  const isFeaturedJob = (value: boolean | undefined) => value === true;
  const featuredJobs = activeJobs.filter((job) =>
    isFeaturedJob(job.isPaidAdvertising),
  );
  const regularJobs = activeJobs.filter((job) =>
    !isFeaturedJob(job.isPaidAdvertising),
  );
  const previousPage = pagination.currentPage > 1 ? pagination.currentPage - 1 : null;
  const nextPage =
    pagination.currentPage < pagination.totalPages
      ? pagination.currentPage + 1
      : null;
  const jobsPath = localizePath("/jobs", locale);

  return (
    <section
      id="jobs"
      className="bg-gray-light py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <FeaturedJobsMarquee jobs={featuredJobs} appliedJobIds={appliedJobIds} />

        {showRegularJobs && regularJobs.length > 0 ? (
          <>
            <div className="border-body-color/15 my-10 border-t" />
            <JobsSearchForm jobs={regularJobs} appliedJobIds={appliedJobIds} />
            {pagination.totalPages > 1 ? (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xs border border-gray-200 bg-white px-6 py-4 text-sm text-body-color shadow-one md:flex-row">
                <p>
                  Página {pagination.currentPage} de {pagination.totalPages}
                </p>
                <div className="flex items-center gap-3">
                  {previousPage ? (
                    <Link
                      href={`${jobsPath}?page=${previousPage}`}
                      className="inline-flex items-center gap-2 rounded-xs border border-gray-800 px-4 py-2 font-medium uppercase text-gray-800 transition-colors hover:border-gray-300 hover:text-gray-300"
                    >
                      <FaRegArrowAltCircleLeft className="text-base" />
                      Anterior
                    </Link>
                  ) : null}
                  {nextPage ? (
                    <Link
                      href={`${jobsPath}?page=${nextPage}`}
                      className="inline-flex items-center gap-2 rounded-xs border border-gray-800 px-4 py-2 font-medium uppercase text-gray-800 transition-colors hover:border-gray-300 hover:text-gray-300"
                    >
                      <FaRegArrowAltCircleRight className="text-base" />
                      Próxima
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Jobs;
