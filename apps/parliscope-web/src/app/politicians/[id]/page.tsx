import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
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
  FOR: { label: "賛成", color: "text-emerald-400" },
  AGAINST: { label: "反対", color: "text-red-400" },
  ABSTAIN: { label: "棄権", color: "text-yellow-400" },
  ABSENT: { label: "欠席", color: "text-[#6b7280]" },
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <a
            href="/politicians"
            className="inline-flex items-center gap-1 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
          >
            &larr; 議員一覧に戻る
          </a>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center gap-5">
          {politician.imageUrl ? (
            <img
              src={politician.imageUrl}
              alt={politician.name}
              className="h-18 w-18 rounded-full object-cover shadow-lg shadow-indigo-500/20"
            />
          ) : (
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
              {politician.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-white">{politician.name}</h2>
            {politician.nameKana && (
              <p className="mt-0.5 text-sm text-[#6b7280]">{politician.nameKana}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              {politician.party && (
                <span className="rounded-full bg-indigo-500/15 px-3 py-0.5 text-xs font-medium text-indigo-300">
                  {politician.party.shortName ?? politician.party.name}
                </span>
              )}
              {politician.chamber && (
                <span className="rounded-full bg-blue-500/15 px-3 py-0.5 text-xs font-medium text-blue-300">
                  {CHAMBER_LABELS[politician.chamber]}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">投票履歴</h3>
              {politician.votes.length > 0 ? (
                <div className="space-y-1">
                  {politician.votes.map((vote) => {
                    const voteConfig = VOTE_LABELS[vote.voteType] ?? {
                      label: vote.voteType,
                      color: "text-[#6b7280]",
                    };
                    return (
                      <div
                        key={vote.id}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                      >
                        <div className="min-w-0 flex-1">
                          <a
                            href={`/bills/${vote.bill.id}`}
                            className="text-sm font-medium text-white transition-colors hover:text-indigo-300"
                          >
                            {vote.bill.title}
                          </a>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6b7280]">
                            <span>{vote.bill.number}</span>
                            <BillStatusBadge status={vote.bill.status} />
                          </div>
                        </div>
                        <span className={`ml-4 shrink-0 text-sm font-semibold ${voteConfig.color}`}>
                          {voteConfig.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#6b7280]">投票データはありません。</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">基本情報</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-[#6b7280]">政党</dt>
                  <dd className="mt-0.5 flex items-center gap-2 font-medium text-white">
                    {politician.party?.logoUrl && (
                      <img
                        src={politician.party.logoUrl}
                        alt={politician.party.name}
                        className="h-5 w-5 object-contain"
                      />
                    )}
                    {politician.party?.name ?? "無所属"}
                  </dd>
                </div>
                {politician.chamber && (
                  <div>
                    <dt className="text-[#6b7280]">議院</dt>
                    <dd className="mt-0.5 font-medium text-white">
                      {CHAMBER_LABELS[politician.chamber]}
                    </dd>
                  </div>
                )}
                {politician.district && (
                  <div>
                    <dt className="text-[#6b7280]">選挙区</dt>
                    <dd className="mt-0.5 font-medium text-white">{politician.district}</dd>
                  </div>
                )}
                {politician.prefecture && (
                  <div>
                    <dt className="text-[#6b7280]">都道府県</dt>
                    <dd className="mt-0.5 font-medium text-white">{politician.prefecture.name}</dd>
                  </div>
                )}
                {politician.profileUrl && (
                  <div>
                    <dt className="text-[#6b7280]">プロフィール</dt>
                    <dd className="mt-0.5">
                      <a
                        href={politician.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 transition-colors hover:text-indigo-300"
                      >
                        Wikipedia &rarr;
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {voteStats.total > 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">投票統計</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#8b949e]">総投票数</dt>
                    <dd className="font-semibold text-white">{voteStats.total}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-emerald-400">賛成</dt>
                    <dd className="font-semibold text-emerald-400">{voteStats.for}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-400">反対</dt>
                    <dd className="font-semibold text-red-400">{voteStats.against}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-yellow-400">棄権</dt>
                    <dd className="font-semibold text-yellow-400">{voteStats.abstain}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6b7280]">欠席</dt>
                    <dd className="font-semibold text-[#6b7280]">{voteStats.absent}</dd>
                  </div>
                </dl>

                {/* Visual vote bar */}
                {voteStats.total > 0 && (
                  <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full">
                    {voteStats.for > 0 && (
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(voteStats.for / voteStats.total) * 100}%` }}
                      />
                    )}
                    {voteStats.against > 0 && (
                      <div
                        className="bg-red-500"
                        style={{ width: `${(voteStats.against / voteStats.total) * 100}%` }}
                      />
                    )}
                    {voteStats.abstain > 0 && (
                      <div
                        className="bg-yellow-500"
                        style={{ width: `${(voteStats.abstain / voteStats.total) * 100}%` }}
                      />
                    )}
                    {voteStats.absent > 0 && (
                      <div
                        className="bg-gray-600"
                        style={{ width: `${(voteStats.absent / voteStats.total) * 100}%` }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
