import { prisma } from "@ojpp/db";
import { Stat, Card, Badge } from "@ojpp/ui";
import { PartyChip } from "@/components/party-chip";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = {
  "教育": "📚",
  "子育て": "👶",
  "医療": "🏥",
  "経済・財政": "💰",
  "デジタル": "💻",
  "エネルギー": "⚡",
  "外交・安全保障": "🌏",
  "福祉": "🤝",
  "産業": "🏭",
  "科学技術": "🔬",
};

export default async function Home() {
  const [policyCount, partyCount, proposalCount, parties, categories, recentProposals] =
    await Promise.all([
      prisma.policy.count(),
      prisma.party.count({ where: { isActive: true, name: { not: "無所属" } } }),
      prisma.policyProposal.count(),
      prisma.party.findMany({
        where: { isActive: true, name: { not: "無所属" } },
        orderBy: { name: "asc" },
      }),
      prisma.policy.groupBy({
        by: ["category"],
        _count: { id: true },
        orderBy: { category: "asc" },
      }),
      prisma.policyProposal.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          policy: { include: { party: true } },
        },
      }),
    ]);

  const categoryCount = categories.length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12">
        <h2 className="mb-4 text-3xl font-bold">すべての政党の政策を、比較できる場所</h2>
        <p className="mb-2 max-w-2xl text-lg text-gray-600">
          PolicyDiffは、各政党の政策をGitで管理し、市民がPull Requestで改善提案できるオープンソースプラットフォームです。
        </p>
        <p className="mb-8 max-w-2xl text-gray-500">
          特定の政党のためではなく、民主主義のインフラとして。
        </p>
      </section>

      <section className="mb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="登録政策数" value={policyCount} />
          <Stat label="政党数" value={partyCount} />
          <Stat label="カテゴリ数" value={categoryCount} />
          <Stat label="提案数" value={proposalCount} />
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 text-2xl font-bold">政策分野</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => (
            <a
              key={cat.category}
              href={`/category/${encodeURIComponent(cat.category)}`}
              className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 text-2xl">{CATEGORY_ICONS[cat.category] ?? "📋"}</div>
              <h4 className="font-semibold">{cat.category}</h4>
              <p className="mt-1 text-xs text-gray-500">{cat._count.id}件の政策</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-6 text-2xl font-bold">政党一覧</h3>
        <div className="flex flex-wrap gap-3">
          {parties.map((party) => (
            <PartyChip
              key={party.id}
              name={party.name}
              color={party.color}
              href={`/party/${encodeURIComponent(party.name)}`}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-6 text-2xl font-bold">最近の政策変更提案</h3>
        {recentProposals.length > 0 ? (
          <div className="space-y-3">
            {recentProposals.map((proposal) => {
              const statusVariant =
                proposal.status === "OPEN"
                  ? "info"
                  : proposal.status === "ACCEPTED"
                    ? "success"
                    : proposal.status === "REJECTED"
                      ? "danger"
                      : "default";
              return (
                <Card key={proposal.id} padding="sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{proposal.title}</h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {proposal.policy.party?.name} / {proposal.policy.title}
                      </p>
                    </div>
                    <Badge variant={statusVariant}>{proposal.status}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="text-center text-gray-500">
              <p>まだ提案がありません。</p>
              <p className="mt-2 text-sm">
                GitHubからPull Requestを送るか、このサイトから提案できます。
              </p>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
