const POLICY_CATEGORIES = [
  { name: "教育", icon: "📚", description: "初等・中等・高等教育、生涯学習" },
  { name: "子育て", icon: "👶", description: "少子化対策、保育、児童福祉" },
  { name: "医療", icon: "🏥", description: "医療制度、公衆衛生、感染症対策" },
  { name: "経済・財政", icon: "💰", description: "税制、財政健全化、経済成長戦略" },
  { name: "デジタル", icon: "💻", description: "DX推進、デジタル民主主義、AI政策" },
  { name: "エネルギー", icon: "⚡", description: "エネルギー政策、脱炭素、原発" },
  { name: "外交・安全保障", icon: "🌏", description: "外交方針、防衛政策、国際協力" },
  { name: "福祉", icon: "🤝", description: "年金、介護、障害者支援、生活保護" },
  { name: "産業", icon: "🏭", description: "産業政策、スタートアップ支援、規制改革" },
  { name: "科学技術", icon: "🔬", description: "研究開発投資、宇宙、量子、バイオ" },
];

const PARTIES = [
  "自民党", "立憲民主党", "日本維新の会", "公明党",
  "国民民主党", "共産党", "れいわ新選組", "社民党", "参政党",
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12">
        <h2 className="mb-4 text-3xl font-bold">すべての政党の政策を、比較できる場所</h2>
        <p className="mb-2 max-w-2xl text-lg text-gray-600">
          OpenPolicyは、各政党の政策をGitで管理し、市民がPull Requestで改善提案できるオープンソースプラットフォームです。
        </p>
        <p className="mb-8 max-w-2xl text-gray-500">
          特定の政党のためではなく、民主主義のインフラとして。
        </p>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 text-2xl font-bold">政策分野</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {POLICY_CATEGORIES.map((cat) => (
            <a key={cat.name} href={`/category/${encodeURIComponent(cat.name)}`} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-2xl">{cat.icon}</div>
              <h4 className="font-semibold">{cat.name}</h4>
              <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 text-2xl font-bold">政党一覧</h3>
        <div className="flex flex-wrap gap-3">
          {PARTIES.map((party) => (
            <a key={party} href={`/party/${encodeURIComponent(party)}`} className="rounded-full border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
              {party}
            </a>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-6 text-2xl font-bold">最近の政策変更提案</h3>
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          <p>まだ提案がありません。</p>
          <p className="mt-2 text-sm">GitHubからPull Requestを送るか、このサイトから提案できます。</p>
        </div>
      </section>
    </div>
  );
}
