"use client";

import { useEffect, useState } from "react";

import { Job } from "@/interfaces/job.interface";

import JobCardDetails from "./JobCardDetails";

type FeaturedJobsMarqueeProps = {
  appliedJobIds: string[];
  jobs: Job[];
};

function getVisibleJobs(jobs: Job[], startIndex: number, count: number) {
  if (jobs.length <= count) {
    return jobs;
  }

  return Array.from({ length: count }, (_, index) => jobs[(startIndex + index) % jobs.length]);
}

export default function FeaturedJobsMarquee({
  appliedJobIds,
  jobs,
}: Readonly<FeaturedJobsMarqueeProps>) {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const appliedJobIdSet = new Set(appliedJobIds);
  const visibleJobs = getVisibleJobs(jobs, startIndex, visibleCount);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCount(3);
        return;
      }

      if (window.innerWidth >= 768) {
        setVisibleCount(2);
        return;
      }

      setVisibleCount(1);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (jobs.length <= visibleCount) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setStartIndex((currentValue) => (currentValue + 1) % jobs.length);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [jobs, visibleCount]);

  return (
    <div className="pb-2">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleJobs.map((job) => (
          <div
            key={`${job.id ?? job.slug}-${startIndex}`}
            className="min-w-0"
          >
            <JobCardDetails
              job={job}
              hasApplied={job.id ? appliedJobIdSet.has(job.id) : false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
