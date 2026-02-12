export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-center">
      <h2 className="mb-2 text-xl font-bold">会期が見つかりません</h2>
      <p className="mb-4 text-gray-600">指定された会期は存在しません。</p>
      <a href="/sessions" className="text-sm text-purple-600 hover:underline">
        会期一覧に戻る
      </a>
    </div>
  );
}
