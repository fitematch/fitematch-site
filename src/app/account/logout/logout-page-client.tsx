"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/api/auth.api";
import { useAuth } from "@/contexts/auth-context";
import { getLocaleFromPathname, localizePath } from "@/i18n/config";

export default function LogoutPageClient() {
  const { accessToken, signOut } = useAuth();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? "pt";
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      if (!accessToken) {
        signOut();
        router.replace(localizePath("/", locale));
        router.refresh();
        return;
      }

      try {
        const success = await logout({
          access_token: accessToken,
        });

        if (success) {
          signOut();
          router.replace(localizePath("/", locale));
          router.refresh();
        }
      } catch {
        return;
      }
    };

    void handleLogout();
  }, [accessToken, locale, router, signOut]);

  return null;
}
