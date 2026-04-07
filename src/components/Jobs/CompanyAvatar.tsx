"use client";

import { useMemo, useState } from "react";

const COMPANY_ASSET_BASE_URL = "http://localhost:3002";

function getCompanyInitials(name?: string) {
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return "EM";
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function resolveCompanyAssetUrl(assetPath?: string | null) {
  const normalizedPath = assetPath?.trim();

  if (!normalizedPath) {
    return null;
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith("public/")) {
    return `/${normalizedPath.replace(/^public\//, "")}`;
  }

  if (
    normalizedPath.startsWith("/images/") ||
    normalizedPath.startsWith("images/")
  ) {
    return normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`;
  }

  if (normalizedPath.startsWith("/")) {
    return `${COMPANY_ASSET_BASE_URL}${normalizedPath}`;
  }

  return `${COMPANY_ASSET_BASE_URL}/${normalizedPath}`;
}

export default function CompanyAvatar({
  logo,
  name,
  sizeClassName,
  textClassName,
}: Readonly<{
  logo?: string | null;
  name?: string;
  sizeClassName: string;
  textClassName: string;
}>) {
  const [hasImageError, setHasImageError] = useState(false);
  const companyInitials = getCompanyInitials(name);
  const logoUrl = useMemo(() => resolveCompanyAssetUrl(logo), [logo]);

  if (logoUrl && !hasImageError) {
    return (
      <img
        src={logoUrl}
        alt={name || "Empresa"}
        className={`${sizeClassName} rounded-full object-cover`}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-black font-bold uppercase text-white ${sizeClassName} ${textClassName}`}
    >
      {companyInitials}
    </div>
  );
}
