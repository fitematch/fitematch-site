'use client';

import { useParams } from 'next/navigation';
import { PrivateRoute } from '@/components/auth/private-route';
import { ApplicationDetails } from '@/components/applications/application-details';

export default function ApplicationDetailsPage() {
  const params = useParams();
  const applyId = params.applyId as string;

  return (
    <PrivateRoute>
      <section className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <ApplicationDetails applyId={applyId} />
        </div>
      </section>
    </PrivateRoute>
  );
}
