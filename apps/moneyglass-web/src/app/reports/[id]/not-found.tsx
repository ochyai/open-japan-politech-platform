import { Button } from "@ojpp/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">報告書が見つかりません</h2>
        <p className="mb-4 text-gray-600">指定された報告書は存在しないか、削除された可能性があります。</p>
        <a href="/">
          <Button>ダッシュボードに戻る</Button>
        </a>
      </div>
    </div>
  );
}
