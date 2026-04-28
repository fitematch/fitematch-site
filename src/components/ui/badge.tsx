export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-gray-900 px-2 py-1 text-xs text-gray-700">
      {children}
    </span>
  );
}
