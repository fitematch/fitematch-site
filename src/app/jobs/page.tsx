import type { Metadata } from "next";
import Jobs from "@/components/Jobs";

export const metadata: Metadata = {
  title: "fitematch | Vagas",
  description: "Confira as vagas disponíveis na fitematch.",
};

type JobsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function parsePage(value?: string) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parsePage(resolvedSearchParams?.page);

  return <main className="pt-8"><Jobs currentPage={currentPage} /></main>;
}
