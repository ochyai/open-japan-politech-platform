import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { Badge, Card } from "@ojpp/ui";
import { BillStatusBadge } from "@/components/bill-status-badge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  ORDINARY: "通常国会",
  EXTRAORDINARY: "臨時国会",
  SPECIAL: "特別国会",
};

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = await prisma.dietSession.findUnique({
    where: { id },
    include: {
      bills: {
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!session) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-4">
        <a href="/sessions" className="text-sm text-purple-600 hover:underline">
          &larr; 会期一覧に戻る
        </a>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">第{session.number}回国会</h2>
          <Badge variant="info">{TYPE_LABELS[session.type] ?? session.type}</Badge>
        </div>
        <p className="mt-2 text-gray-600">
          {new Date(session.startDate).toLocaleDateString("ja-JP")}
          {session.endDate && ` 〜 ${new Date(session.endDate).toLocaleDateString("ja-JP")}`}
        </p>
        <p className="mt-1 text-sm text-gray-500">{session.bills.length}件の法案</p>
      </div>

      <h3 className="mb-4 text-xl font-bold">法案一覧</h3>
      <div className="space-y-3">
        {session.bills.map((bill) => (
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
                {bill.submittedAt ? new Date(bill.submittedAt).toLocaleDateString("ja-JP") : ""}
              </span>
            </div>
          </Card>
        ))}
        {session.bills.length === 0 && (
          <Card>
            <p className="text-center text-gray-500">この会期の法案データはありません。</p>
          </Card>
        )}
      </div>
    </div>
  );
}
