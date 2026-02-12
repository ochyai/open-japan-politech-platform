"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center">
      <h2 className="mb-2 text-xl font-bold text-red-600">会期データの読み込みに失敗しました</h2>
      <button
        onClick={reset}
        className="mt-4 rounded bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
      >
        再試行
      </button>
    </div>
  );
}
