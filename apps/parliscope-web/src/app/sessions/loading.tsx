export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg border bg-white" />
        ))}
      </div>
    </div>
  );
}
