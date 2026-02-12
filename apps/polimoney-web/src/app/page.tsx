export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12">
        <h2 className="mb-4 text-3xl font-bold">政治資金の流れを、誰でも見える形に</h2>
        <p className="mb-8 max-w-2xl text-lg text-gray-600">
          OpenFundsは、政治家・政治団体の会計データを透明に可視化するオープンソースプラットフォームです。
          特定の政党に依存せず、すべての政治家が利用できます。
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="会計データの可視化"
            description="収入・支出の内訳をグラフで分かりやすく表示。クラウド会計ソフトからのデータ取り込みに対応。"
          />
          <FeatureCard
            title="政治資金報告書の生成"
            description="取り込んだデータから政治資金収支報告書のXMLを自動生成。手作業のミスを削減。"
          />
          <FeatureCard
            title="市民による監視"
            description="公開されたデータを誰でも閲覧・検証可能。透明性による信頼の構築。"
          />
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 text-2xl font-bold">最近公開された政治資金データ</h3>
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          <p className="text-lg">まだデータがありません</p>
          <p className="mt-2 text-sm">
            政治家・団体が会計データを登録すると、ここに表示されます。
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
