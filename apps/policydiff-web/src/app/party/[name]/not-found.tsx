import { Card } from "@ojpp/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Card>
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">政党が見つかりません</h2>
          <p className="mb-4 text-gray-600">指定された政党は登録されていません。</p>
          <a href="/" className="text-green-600 hover:underline">
            トップページに戻る
          </a>
        </div>
      </Card>
    </div>
  );
}
