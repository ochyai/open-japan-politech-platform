import { prisma } from "@ojpp/db";
import { Card, Stat } from "@ojpp/ui";
import { BillStatusBadge } from "@/components/bill-status-badge";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [billCount, politicianCount, sessionCount, enactedCount, recentBills, statusCounts] =
    await Promise.all([
      prisma.bill.count(),
      prisma.politician.count(),
      prisma.dietSession.count(),
      prisma.bill.count({ where: { status: "ENACTED" } }),
      prisma.bill.findMany({
        take: 10,
        orderBy: { submittedAt: "desc" },
        include: { session: true },
      }),
      prisma.bill.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

  const statusMap: Record<string, number> = {};
  for (const item of statusCounts) {
    statusMap[item.status] = item._count.id;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12">
        <h2 className="mb-2 text-3xl font-bold">ParliScope</h2>
        <p className="mb-8 text-gray-600">
          国会の法案・会期・議員データを可視化するオープンプラットフォーム
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="法案数" value={billCount} />
          <Stat label="議員数" value={politicianCount} />
          <Stat label="成立法案" value={enactedCount} />
          <Stat label="会期数" value={sessionCount} />
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold">ステータス別法案数</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(statusMap).map(([status, count]) => (
            <Card key={status} padding="sm">
              <div className="flex items-center justify-between">
                <BillStatusBadge status={status} />
                <span className="text-lg font-bold">{count}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">最新の法案</h3>
          <a href="/bills" className="text-sm text-purple-600 hover:underline">
            すべて見る
          </a>
        </div>
        <div className="space-y-3">
          {recentBills.map((bill) => (
            <Card key={bill.id} padding="sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500">{bill.number}</span>
                    <BillStatusBadge status={bill.status} />
                    {bill.category && (
                      <span className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                        {bill.category}
                      </span>
                    )}
                  </div>
                  <a href={`/bills/${bill.id}`} className="font-semibold hover:text-purple-600">
                    {bill.title}
                  </a>
                  {bill.summary && (
                    <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">{bill.summary}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  第{bill.session.number}回国会
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
