"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold text-red-600">エラーが発生しました</h2>
        <p className="mb-4 text-gray-600">ページの読み込み中に問題が発生しました。</p>
        <button
          onClick={reset}
          className="rounded bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
