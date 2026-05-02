import { TbZoomCancel } from 'react-icons/tb';

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-red-900 bg-red-100 px-5 py-4 text-left text-red-900">
      <div className="flex items-center gap-3">
        <TbZoomCancel className="h-5 w-5 shrink-0 text-red-900" />
        <span>{message}</span>
      </div>
    </div>
  );
}
