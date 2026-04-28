import { FaqTabs } from '@/components/faq/faq-tabs';

export default function FaqPage() {
  return (
    <section className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-100">
          FAQ
        </h1>

        <p className="mt-3 text-gray-700">
          Tire suas dúvidas sobre cadastro, ativação, vagas e aplicações.
        </p>

        <div className="mt-10">
          <FaqTabs />
        </div>
      </div>
    </section>
  );
}