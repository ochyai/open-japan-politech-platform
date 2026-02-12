export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold">ページが見つかりません</h2>
        <p className="mb-4 text-gray-600">お探しのページは存在しないか、移動した可能性があります。</p>
        <a href="/" className="text-sm text-purple-600 hover:underline">
          ダッシュボードに戻る
        </a>
      </div>
    </div>
  );
}
