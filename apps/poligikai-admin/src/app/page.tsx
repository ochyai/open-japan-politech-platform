export default function AdminHome() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">管理ダッシュボード</h2>
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="登録法案数" value="0" />
        <StatCard label="審議中" value="0" />
        <StatCard label="議論スレッド" value="0" />
        <StatCard label="参加者数" value="0" />
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
