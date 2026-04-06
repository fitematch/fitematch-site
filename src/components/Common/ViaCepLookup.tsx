"use client";

import { useEffect, useRef } from "react";

type ViaCepResponse = {
  bairro?: string;
  erro?: boolean;
  localidade?: string;
  logradouro?: string;
  uf?: string;
};

type ViaCepLookupProps = {
  onError: () => void;
  onSuccess: (address: {
    city: string;
    neighborhood: string;
    state: string;
    street: string;
  }) => void;
  zipCode: string;
};

function normalizeZipCode(zipCode: string) {
  return zipCode.replace(/\D/g, "");
}

export default function ViaCepLookup({
  onError,
  onSuccess,
  zipCode,
}: Readonly<ViaCepLookupProps>) {
  const lastFetchedZipCodeRef = useRef<string>("");

  useEffect(() => {
    const normalizedZipCode = normalizeZipCode(zipCode);

    if (normalizedZipCode.length !== 8) {
      lastFetchedZipCodeRef.current = "";
      return;
    }

    if (lastFetchedZipCodeRef.current === normalizedZipCode) {
      return;
    }

    let isCancelled = false;

    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${normalizedZipCode}/json/`,
        );

        if (!response.ok) {
          throw new Error("ViaCEP request failed");
        }

        const data = (await response.json()) as ViaCepResponse;

        if (isCancelled || data.erro) {
          throw new Error("Invalid CEP");
        }

        lastFetchedZipCodeRef.current = normalizedZipCode;
        onSuccess({
          city: data.localidade?.trim() || "",
          neighborhood: data.bairro?.trim() || "",
          state: data.uf?.trim() || "",
          street: data.logradouro?.trim() || "",
        });
      } catch {
        if (!isCancelled) {
          onError();
        }
      }
    };

    void fetchAddress();

    return () => {
      isCancelled = true;
    };
  }, [onError, onSuccess, zipCode]);

  return null;
}
