'use client';

import { FaSearch } from 'react-icons/fa';
import { Input } from '@/components/ui/input';

interface JobSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobSearchInput({ value, onChange }: JobSearchInputProps) {
  return (
    <Input
      icon={<FaSearch />}
      placeholder="BUSQUE SUA VAGA"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
