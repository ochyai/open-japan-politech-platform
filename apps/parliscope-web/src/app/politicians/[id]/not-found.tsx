export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center">
      <h2 className="mb-2 text-xl font-bold">議員が見つかりません</h2>
      <p className="mb-4 text-gray-600">指定された議員は存在しないか、データが更新された可能性があります。</p>
      <a href="/politicians" className="text-sm text-purple-600 hover:underline">
        議員一覧に戻る
      </a>
    </div>
  );
}
