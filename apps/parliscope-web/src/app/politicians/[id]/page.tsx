import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { Badge, Card } from "@ojpp/ui";
import { BillStatusBadge } from "@/components/bill-status-badge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CHAMBER_LABELS: Record<string, string> = {
  HOUSE_OF_REPRESENTATIVES: "衆議院",
  HOUSE_OF_COUNCILLORS: "参議院",
};

const VOTE_LABELS: Record<string, { label: string; color: string }> = {
  FOR: { label: "賛成", color: "text-green-600" },
  AGAINST: { label: "反対", color: "text-red-600" },
  ABSTAIN: { label: "棄権", color: "text-yellow-600" },
  ABSENT: { label: "欠席", color: "text-gray-500" },
};

export default async function PoliticianDetailPage({ params }: PageProps) {
  const { id } = await params;

  const politician = await prisma.politician.findUnique({
    where: { id },
    include: {
      party: true,
      prefecture: true,
      votes: {
        include: {
          bill: { include: { session: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!politician) {
    notFound();
  }

  const voteStats = {
    total: politician.votes.length,
    for: politician.votes.filter((v) => v.voteType === "FOR").length,
    against: politician.votes.filter((v) => v.voteType === "AGAINST").length,
    abstain: politician.votes.filter((v) => v.voteType === "ABSTAIN").length,
    absent: politician.votes.filter((v) => v.voteType === "ABSENT").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-4">
        <a href="/politicians" className="text-sm text-purple-600 hover:underline">
          &larr; 議員一覧に戻る
        </a>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
          {politician.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{politician.name}</h2>
          {politician.nameKana && (
            <p className="text-sm text-gray-500">{politician.nameKana}</p>
          )}
          <div className="mt-1 flex items-center gap-2">
            {politician.party && (
              <Badge>{politician.party.shortName ?? politician.party.name}</Badge>
            )}
            {politician.chamber && (
              <Badge variant="info">{CHAMBER_LABELS[politician.chamber]}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 font-semibold">投票履歴</h3>
            {politician.votes.length > 0 ? (
              <div className="space-y-2">
                {politician.votes.map((vote) => {
                  const voteConfig = VOTE_LABELS[vote.voteType] ?? {
                    label: vote.voteType,
                    color: "text-gray-500",
                  };
                  return (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between rounded px-3 py-2 hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <a
                          href={`/bills/${vote.bill.id}`}
                          className="text-sm font-medium hover:text-purple-600"
                        >
                          {vote.bill.title}
                        </a>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{vote.bill.number}</span>
                          <BillStatusBadge status={vote.bill.status} />
                        </div>
                      </div>
                      <span className={`ml-4 shrink-0 text-sm font-medium ${voteConfig.color}`}>
                        {voteConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">投票データはありません。</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 font-semibold">基本情報</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">政党</dt>
                <dd className="font-medium">{politician.party?.name ?? "無所属"}</dd>
              </div>
              {politician.chamber && (
                <div>
                  <dt className="text-gray-500">議院</dt>
                  <dd className="font-medium">{CHAMBER_LABELS[politician.chamber]}</dd>
                </div>
              )}
              {politician.district && (
                <div>
                  <dt className="text-gray-500">選挙区</dt>
                  <dd className="font-medium">{politician.district}</dd>
                </div>
              )}
              {politician.prefecture && (
                <div>
                  <dt className="text-gray-500">都道府県</dt>
                  <dd className="font-medium">{politician.prefecture.name}</dd>
                </div>
              )}
            </dl>
          </Card>

          {voteStats.total > 0 && (
            <Card>
              <h3 className="mb-3 font-semibold">投票統計</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">総投票数</dt>
                  <dd className="font-medium">{voteStats.total}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-green-600">賛成</dt>
                  <dd className="font-medium">{voteStats.for}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-red-600">反対</dt>
                  <dd className="font-medium">{voteStats.against}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-yellow-600">棄権</dt>
                  <dd className="font-medium">{voteStats.abstain}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">欠席</dt>
                  <dd className="font-medium">{voteStats.absent}</dd>
                </div>
              </dl>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
