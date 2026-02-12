export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12">
        <h2 className="mb-4 text-3xl font-bold">国会で何が議論されているか、知ろう</h2>
        <p className="mb-8 max-w-2xl text-lg text-gray-600">
          OpenGikaiは、国会・地方議会の法案を分かりやすく可視化し、
          市民が議論に参加できるオープンソースプラットフォームです。
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="法案の可視化"
            description="難解な法案をAIが要約。賛否の論点を分かりやすく整理。"
            color="purple"
          />
          <FeatureCard
            title="模擬審議"
            description="市民が法案について議論し、賛否を表明。模擬投票で世論を可視化。"
            color="purple"
          />
          <FeatureCard
            title="議員の活動追跡"
            description="各議員の投票行動・発言・出席率を横断的に比較。"
            color="purple"
          />
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 text-2xl font-bold">現在審議中の法案</h3>
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          <p className="text-lg">国会APIからデータを取得中...</p>
          <p className="mt-2 text-sm">衆議院・参議院の法案データを自動収集します。</p>
        </div>
      </section>

      <section>
        <h3 className="mb-6 text-2xl font-bold">最近の議論</h3>
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          <p>まだ議論がありません。法案ページから議論を始めましょう。</p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
