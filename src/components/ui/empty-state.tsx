export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-gray-700 py-20">
      {message}
    </div>
  );
}
