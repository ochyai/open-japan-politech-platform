export default function AdminHome() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">管理ダッシュボード</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="総収入" value="¥0" />
        <StatCard label="総支出" value="¥0" />
        <StatCard label="取引件数" value="0件" />
      </div>
      <div className="mt-8 rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">クイックスタート</h3>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-600">
          <li>「データ取り込み」から会計ソフトのCSVをアップロード</li>
          <li>取引データを確認・分類</li>
          <li>「報告書生成」から政治資金収支報告書XMLを出力</li>
        </ol>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
