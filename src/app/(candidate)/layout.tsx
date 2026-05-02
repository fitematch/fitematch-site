import { ReactNode } from 'react';
import { RoleRoute } from '@/components/auth/role-route';
import { ProductRoleEnum } from '@/types/entities/user.entity';

export default function CandidateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleRoute allowedRoles={[ProductRoleEnum.CANDIDATE]}>
      {children}
    </RoleRoute>
  );
}
