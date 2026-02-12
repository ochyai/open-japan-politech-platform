export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center">
      <h2 className="mb-2 text-xl font-bold">法案が見つかりません</h2>
      <p className="mb-4 text-gray-600">指定された法案は存在しないか、削除された可能性があります。</p>
      <a href="/bills" className="text-sm text-purple-600 hover:underline">
        法案一覧に戻る
      </a>
    </div>
  );
}
