import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { Card } from "@ojpp/ui";
import { BillStatusBadge } from "@/components/bill-status-badge";
import { DiscussionThread } from "@/components/discussion-thread";

export const dynamic = "force-dynamic";
import { VoteChart } from "@/components/vote-chart";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BillDetailPage({ params }: PageProps) {
  const { id } = await params;

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      session: true,
      votes: {
        include: { politician: { include: { party: true } } },
      },
      discussions: {
        where: { parentId: null },
        include: { replies: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!bill) {
    notFound();
  }

  const voteCounts = {
    FOR: bill.votes.filter((v) => v.voteType === "FOR").length,
    AGAINST: bill.votes.filter((v) => v.voteType === "AGAINST").length,
    ABSTAIN: bill.votes.filter((v) => v.voteType === "ABSTAIN").length,
    ABSENT: bill.votes.filter((v) => v.voteType === "ABSENT").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-4">
        <a href="/bills" className="text-sm text-purple-600 hover:underline">
          &larr; 法案一覧に戻る
        </a>
      </div>

      <div className="mb-6 flex items-start gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-gray-500">{bill.number}</span>
            <BillStatusBadge status={bill.status} />
            {bill.category && (
              <span className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                {bill.category}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold">{bill.title}</h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {bill.summary && (
            <Card>
              <h3 className="mb-2 font-semibold">概要</h3>
              <p className="text-gray-700">{bill.summary}</p>
            </Card>
          )}

          <Card>
            <h3 className="mb-4 font-semibold">投票結果</h3>
            <VoteChart votes={voteCounts} />
            {bill.votes.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">投票詳細</h4>
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {bill.votes.map((vote) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-gray-50"
                    >
                      <a
                        href={`/politicians/${vote.politician.id}`}
                        className="hover:text-purple-600"
                      >
                        {vote.politician.name}
                        {vote.politician.party && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({vote.politician.party.shortName ?? vote.politician.party.name})
                          </span>
                        )}
                      </a>
                      <span
                        className={`text-xs font-medium ${
                          vote.voteType === "FOR"
                            ? "text-green-600"
                            : vote.voteType === "AGAINST"
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {vote.voteType === "FOR"
                          ? "賛成"
                          : vote.voteType === "AGAINST"
                            ? "反対"
                            : vote.voteType === "ABSTAIN"
                              ? "棄権"
                              : "欠席"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">議論</h3>
            <DiscussionThread discussions={bill.discussions} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 font-semibold">基本情報</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">提出者</dt>
                <dd className="font-medium">{bill.proposer ?? "不明"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">会期</dt>
                <dd className="font-medium">
                  <a href={`/sessions/${bill.session.id}`} className="hover:text-purple-600">
                    第{bill.session.number}回国会
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">提出日</dt>
                <dd className="font-medium">
                  {bill.submittedAt ? new Date(bill.submittedAt).toLocaleDateString("ja-JP") : "不明"}
                </dd>
              </div>
              {bill.passedAt && (
                <div>
                  <dt className="text-gray-500">成立日</dt>
                  <dd className="font-medium">
                    {new Date(bill.passedAt).toLocaleDateString("ja-JP")}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">投票数</dt>
                <dd className="font-medium">{bill.votes.length}票</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
