"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

const GUEST_ONLY_PATHS = new Set([
  "/account/login",
  "/account/signup",
  "/account/candidate/register",
  "/account/recruiter/register",
]);

export default function AuthRouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isGuestOnlyPath = GUEST_ONLY_PATHS.has(pathname);
    const isAccountPath = pathname === "/account" || pathname.startsWith("/account/");
    const isProtectedAccountPath = isAccountPath && !isGuestOnlyPath;
    const isCandidateApplicationsPath = pathname === "/jobs/applications";

    if (isAuthenticated && GUEST_ONLY_PATHS.has(pathname)) {
      router.replace("/");
      router.refresh();
      return;
    }

    if (!isAuthenticated && isProtectedAccountPath) {
      router.replace("/");
      router.refresh();
      return;
    }

    if (!isAuthenticated && isCandidateApplicationsPath) {
      router.replace("/");
      router.refresh();
      return;
    }

    if (pathname === "/account/advertisement" && role && role !== "recruiter") {
      router.replace("/jobs/applications");
      router.refresh();
      return;
    }

    if (pathname === "/jobs/applications" && role && role !== "candidate") {
      router.replace("/account/advertisement");
      router.refresh();
    }
  }, [isAuthenticated, pathname, role, router]);

  return children;
}
