export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg border bg-white" />
        ))}
      </div>
    </div>
  );
}
