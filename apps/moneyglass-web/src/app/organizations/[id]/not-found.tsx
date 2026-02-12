import { Button } from "@ojpp/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">団体が見つかりません</h2>
        <p className="mb-4 text-gray-600">指定された団体は存在しないか、削除された可能性があります。</p>
        <a href="/organizations">
          <Button>団体一覧に戻る</Button>
        </a>
      </div>
    </div>
  );
}
