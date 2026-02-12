export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="animate-pulse space-y-6">
        <div className="flex gap-3">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-24 rounded-full bg-gray-200" />
        </div>
        <div className="h-10 w-96 rounded bg-gray-200" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-96 rounded-lg bg-gray-200" />
          </div>
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-gray-200" />
            <div className="h-32 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
