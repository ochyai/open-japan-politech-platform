"use client";

import { Button } from "@ojpp/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">エラーが発生しました</h2>
        <p className="mb-4 text-gray-600">{error.message || "予期しないエラーです"}</p>
        <Button onClick={reset}>再試行</Button>
      </div>
    </div>
  );
}
