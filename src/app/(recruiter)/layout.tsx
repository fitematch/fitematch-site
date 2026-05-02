import { RoleRoute } from '@/components/auth/role-route';
import { ProductRoleEnum } from '@/types/entities/user.entity';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleRoute allowedRoles={[ProductRoleEnum.RECRUITER]}>
      {children}
    </RoleRoute>
  );
}
