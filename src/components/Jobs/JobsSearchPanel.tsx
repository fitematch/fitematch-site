"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCleaningServices } from "react-icons/md";

const inputClassName =
  "w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-blue-900";

function SwitchField({
  checked,
  label,
  onChange,
}: Readonly<{
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}>) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xs border border-gray-200 bg-white px-4 py-3">
      <span className="text-sm font-medium uppercase text-black">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
          checked ? "bg-green-900" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
        <span className="sr-only">{label}</span>
      </button>
    </label>
  );
}

type FiltersState = {
  alimentation: boolean;
  health: boolean;
  parking: boolean;
  title: string;
  transportation: boolean;
};

const initialFilters: FiltersState = {
  alimentation: false,
  health: false,
  parking: false,
  title: "",
  transportation: false,
};

export default function JobsSearchPanel() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  return (
    <div className="mb-12 w-full rounded-xs border border-gray-200 bg-white p-6 shadow-one md:p-8">
      <form className="space-y-6">
        <div>
          <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
            <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-body-color">
              <CiSearch className="text-xl" />
            </span>
            <input
              id="jobs-search-title"
              type="text"
              value={filters.title}
              onChange={(event) => setFilters((current) => ({ ...current, title: event.target.value }))}
              className="w-full px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 placeholder:uppercase"
              placeholder="Busque sua vaga"
            />
          </div>
        </div>

        <div className="border-body-color/15 border-t" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SwitchField
            label="VT"
            checked={filters.transportation}
            onChange={(value) => setFilters((current) => ({ ...current, transportation: value }))}
          />
          <SwitchField
            label="Plano de Saúde"
            checked={filters.health}
            onChange={(value) => setFilters((current) => ({ ...current, health: value }))}
          />
          <SwitchField
            label="VA / VR"
            checked={filters.alimentation}
            onChange={(value) => setFilters((current) => ({ ...current, alimentation: value }))}
          />
          <SwitchField
            label="Estacionamento"
            checked={filters.parking}
            onChange={(value) => setFilters((current) => ({ ...current, parking: value }))}
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            <MdOutlineCleaningServices className="text-lg" />
            Limpar Busca
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <CiSearch className="text-xl" />
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}
