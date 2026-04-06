import AdvertisementPageClient from "@/components/Advertisement/AdvertisementPageClient";

export default function JobApplicationsPage() {
  return (
    <AdvertisementPageClient
      companies={[]}
      title="Processos Seletivos"
      description="Acompanhe seus processos seletivos e visualize o andamento das suas candidaturas."
      showCreateAction={false}
    />
  );
}
