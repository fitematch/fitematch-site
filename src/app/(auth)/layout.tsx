import { AuthOnlyRoute } from '@/components/auth/auth-only-route';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthOnlyRoute>{children}</AuthOnlyRoute>;
}
