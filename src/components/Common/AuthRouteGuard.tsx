"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";
import { getLocaleFromPathname, localizePath } from "@/i18n/config";

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
  const locale = getLocaleFromPathname(pathname) ?? "pt";
  const normalizedPathname = pathname.replace(/^\/(pt|es|en)(?=\/|$)/, "") || "/";
  const router = useRouter();

  useEffect(() => {
    const isGuestOnlyPath = GUEST_ONLY_PATHS.has(normalizedPathname);
    const isAccountPath =
      normalizedPathname === "/account" || normalizedPathname.startsWith("/account/");
    const isProtectedAccountPath = isAccountPath && !isGuestOnlyPath;
    const isCandidateApplicationsPath = normalizedPathname === "/jobs/applications";

    if (isAuthenticated && GUEST_ONLY_PATHS.has(normalizedPathname)) {
      router.replace(localizePath("/", locale));
      router.refresh();
      return;
    }

    if (!isAuthenticated && isProtectedAccountPath) {
      router.replace(localizePath("/", locale));
      router.refresh();
      return;
    }

    if (!isAuthenticated && isCandidateApplicationsPath) {
      router.replace(localizePath("/", locale));
      router.refresh();
      return;
    }

    if (normalizedPathname === "/account/advertisement" && role && role !== "recruiter") {
      router.replace(localizePath("/jobs/applications", locale));
      router.refresh();
      return;
    }

    if (normalizedPathname === "/jobs/applications" && role && role !== "candidate") {
      router.replace(localizePath("/account/advertisement", locale));
      router.refresh();
    }
  }, [isAuthenticated, locale, normalizedPathname, role, router]);

  return children;
}
