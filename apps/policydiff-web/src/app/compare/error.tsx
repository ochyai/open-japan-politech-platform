"use client";

import { Card, Button } from "@ojpp/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Card>
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-red-600">エラーが発生しました</h2>
          <p className="mb-4 text-gray-600">{error.message || "比較の読み込みに失敗しました。"}</p>
          <Button onClick={() => reset()}>再試行</Button>
        </div>
      </Card>
    </div>
  );
}
