import { FaSearch } from 'react-icons/fa';
import { Input } from '@/components/ui/input';

export function JobSearchInput() {
  return (
    <Input
      icon={<FaSearch />}
      placeholder="BUSQUE SUA VAGA"
    />
  );
}
