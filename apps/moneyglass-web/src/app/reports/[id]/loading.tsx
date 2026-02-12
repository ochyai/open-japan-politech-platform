export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 h-10 w-80 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border bg-gray-100" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-lg border bg-gray-100" />
        <div className="h-80 animate-pulse rounded-lg border bg-gray-100" />
      </div>
    </div>
  );
}
