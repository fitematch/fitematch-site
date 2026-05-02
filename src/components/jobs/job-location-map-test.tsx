'use client';

import { renderToStaticMarkup } from 'react-dom/server';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { MdOutlineSocialDistance, MdPlace } from 'react-icons/md';
import { useAuth } from '@/hooks/use-auth';
import { PublicCompanyResponse } from '@/services/company/company.types';
import { CARD_STYLES } from '@/constants/styles';

type Coordinates = {
  lat: number;
  lng: number;
};

function buildAddressQuery(address?: {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) {
  if (!address) {
    return '';
  }

  return [
    address.street,
    address.number,
    address.neighborhood,
    address.complement,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
}

async function geocodeAddress(query: string): Promise<Coordinates | null> {
  if (!query) {
    return null;
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error('Geocoding failed');
  }

  const data = (await response.json()) as Array<{ lat: string; lon: string }>;

  if (!data.length) {
    return null;
  }

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
  };
}

function calculateDistanceInKm(from: Coordinates, to: Coordinates) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

interface JobLocationMapTestProps {
  company?: PublicCompanyResponse;
}

export function JobLocationMapTest({ company }: JobLocationMapTestProps) {
  const { user, isAuthenticated } = useAuth();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<unknown>(null);
  const [companyCoordinates, setCompanyCoordinates] = useState<Coordinates | null>(null);
  const [candidateCoordinates, setCandidateCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const companyAddressQuery = useMemo(
    () => buildAddressQuery(company?.contacts?.address),
    [company?.contacts?.address]
  );
  const candidateAddressQuery = useMemo(
    () => buildAddressQuery(user?.candidateProfile?.contacts?.address),
    [user?.candidateProfile?.contacts?.address]
  );

  useEffect(() => {
    let isActive = true;

    async function loadCoordinates() {
      try {
        setIsLoading(true);
        setError(null);

        const nextCompanyCoordinates = await geocodeAddress(companyAddressQuery);
        const nextCandidateCoordinates =
          isAuthenticated && candidateAddressQuery
            ? await geocodeAddress(candidateAddressQuery)
            : null;

        if (!isActive) {
          return;
        }

        setCompanyCoordinates(nextCompanyCoordinates);
        setCandidateCoordinates(nextCandidateCoordinates);
      } catch {
        if (!isActive) {
          return;
        }

        setError('Não foi possível carregar o mapa navegável.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCoordinates();

    return () => {
      isActive = false;
    };
  }, [candidateAddressQuery, companyAddressQuery, isAuthenticated]);

  useEffect(() => {
    let isMounted = true;

    async function renderMap() {
      if (!mapRef.current || !companyCoordinates) {
        return;
      }

      const L = await import('leaflet');

      if (!isMounted || !mapRef.current) {
        return;
      }

      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [companyCoordinates.lat, companyCoordinates.lng],
        zoom: 16,
        scrollWheelZoom: true,
      });

      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const companyIcon = L.divIcon({
        html: renderToStaticMarkup(
          <MdPlace className="h-8 w-8 text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]" />
        ),
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        popupAnchor: [0, -28],
      });

      L.marker([companyCoordinates.lat, companyCoordinates.lng], {
        icon: companyIcon,
      })
        .addTo(map)
        .bindPopup(company?.tradeName || 'Academia');

      if (candidateCoordinates) {
        const candidateIcon = L.divIcon({
          html: renderToStaticMarkup(
            <FaHome className="h-5 w-5 text-blue-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]" />
          ),
          className: 'flex items-center justify-center rounded-full bg-white/95 border border-blue-400 shadow-sm',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -12],
        });

        L.marker([candidateCoordinates.lat, candidateCoordinates.lng], {
          icon: candidateIcon,
        })
          .addTo(map)
          .bindPopup(user?.name || 'Candidato');

        const bounds = L.latLngBounds(
          [companyCoordinates.lat, companyCoordinates.lng],
          [candidateCoordinates.lat, candidateCoordinates.lng]
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }

    void renderMap();

    return () => {
      isMounted = false;
    };
  }, [candidateCoordinates, company?.tradeName, companyCoordinates, user?.name]);

  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const distance =
    companyCoordinates && candidateCoordinates
      ? calculateDistanceInKm(candidateCoordinates, companyCoordinates)
      : null;
  const companyLocation = [
    company?.contacts?.address?.street,
    company?.contacts?.address?.number,
    company?.contacts?.address?.complement,
    company?.contacts?.address?.neighborhood,
    company?.contacts?.address?.city,
    company?.contacts?.address?.state,
  ]
    .filter(Boolean)
    .join(' - ');
  const googleMapsAddressQuery = buildAddressQuery(company?.contacts?.address);
  const googleMapsUrl = googleMapsAddressQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsAddressQuery)}`
    : null;

  return (
    <div className={`${CARD_STYLES.jobCard} border-slate-700/70 bg-zinc-950 shadow-[0_12px_32px_rgba(0,0,0,0.26)]`}>
      <div className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-100">
        <MdPlace className="h-6 w-6" />
        <span>Localização</span>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-gray-500 bg-black px-4 py-8 text-sm text-gray-300">
          Carregando mapa...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-gray-500 bg-black px-4 py-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {!isLoading && !error && !companyCoordinates && (
        <div className="rounded-xl border border-gray-500 bg-black px-4 py-4 text-sm text-gray-300">
          Não foi possível localizar a academia no mapa.
        </div>
      )}

      {!isLoading && !error && companyCoordinates && (
        <>
          <div ref={mapRef} className="h-[260px] w-full rounded-xl border border-gray-500" />
          <div className="mt-5 space-y-3 text-sm text-gray-300">
            {companyLocation && (
              <a
                href={googleMapsUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700/70 bg-black/50 px-3 py-3 transition-colors hover:border-slate-500 hover:bg-black/65"
              >
                <MdPlace className="mt-0.5 h-4 w-4 shrink-0 text-gray-200" />
                <p className="leading-6">{companyLocation}</p>
              </a>
            )}
            {candidateCoordinates ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-black/50 px-3 py-3">
                <MdOutlineSocialDistance className="h-4 w-4 shrink-0 text-gray-100" />
                <p>{distance?.toFixed(2)} km</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-black/50 px-3 py-3">
                <MdOutlineSocialDistance className="h-4 w-4 shrink-0 text-gray-100" />
                <p>Indisponível. Complete seu endereço no perfil para calcular.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
