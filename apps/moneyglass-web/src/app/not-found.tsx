import { Button } from "@ojpp/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">ページが見つかりません</h2>
        <p className="mb-4 text-gray-600">お探しのページは存在しないか、移動した可能性があります。</p>
        <a href="/">
          <Button>ダッシュボードに戻る</Button>
        </a>
      </div>
    </div>
  );
}
