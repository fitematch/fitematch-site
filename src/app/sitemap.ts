import { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/routes';
import { absoluteUrl } from '@/constants/seo';
import { JobService } from '@/services/job/job.service';

function toDate(value?: string | Date) {
  if (!value) {
    return new Date();
  }

  return new Date(value);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.HOME), lastModified: new Date() },
    { url: absoluteUrl(ROUTES.JOBS), lastModified: new Date() },
    { url: absoluteUrl(ROUTES.FAQ), lastModified: new Date() },
    { url: absoluteUrl(ROUTES.TERMS_OF_USE), lastModified: new Date() },
    { url: absoluteUrl(ROUTES.PRIVACY_POLICY), lastModified: new Date() },
  ];

  try {
    const jobs = await JobService.list();

    return [
      ...staticRoutes,
      ...jobs.map((job) => ({
        url: absoluteUrl(`${ROUTES.JOBS}/${job._id}`),
        lastModified: toDate(
          (job.updatedAt as string | Date | undefined) ||
            (job.createdAt as string | Date | undefined)
        ),
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
