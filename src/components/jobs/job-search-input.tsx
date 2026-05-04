'use client';

import { FaSearch } from 'react-icons/fa';

interface JobSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobSearchInput({ value, onChange }: JobSearchInputProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-black p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_28%)]" />
      <div className="relative">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/85">
            Busca de vagas
          </p>
        </div>

        <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/50 p-3 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-[0_10px_30px_rgba(16,185,129,0.35)]">
              <FaSearch className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <input
                id="jobs-search"
                type="text"
                placeholder="Ex.: Personal Trainer ou São Paulo ou CLT ou PJ"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-lg font-semibold text-white outline-none placeholder:text-gray-500 md:text-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
