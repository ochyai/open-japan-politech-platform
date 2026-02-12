import { prisma } from "@ojpp/db";
import { Card, Badge } from "@ojpp/ui";

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const proposals = await prisma.policyProposal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      policy: {
        include: { party: true },
      },
    },
  });

  const statusCounts = {
    OPEN: proposals.filter((p) => p.status === "OPEN").length,
    UNDER_REVIEW: proposals.filter((p) => p.status === "UNDER_REVIEW").length,
    ACCEPTED: proposals.filter((p) => p.status === "ACCEPTED").length,
    REJECTED: proposals.filter((p) => p.status === "REJECTED").length,
    WITHDRAWN: proposals.filter((p) => p.status === "WITHDRAWN").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold">政策変更提案</h2>
      <p className="mb-8 text-gray-600">
        市民から寄せられた政策の改善提案一覧です。GitHubのPull Requestのように、政策への変更を提案できます。
      </p>

      <div className="mb-8 flex flex-wrap gap-3">
        <Badge variant="info">OPEN: {statusCounts.OPEN}</Badge>
        <Badge variant="warning">UNDER_REVIEW: {statusCounts.UNDER_REVIEW}</Badge>
        <Badge variant="success">ACCEPTED: {statusCounts.ACCEPTED}</Badge>
        <Badge variant="danger">REJECTED: {statusCounts.REJECTED}</Badge>
        <Badge>WITHDRAWN: {statusCounts.WITHDRAWN}</Badge>
      </div>

      {proposals.length > 0 ? (
        <div className="space-y-3">
          {proposals.map((proposal) => {
            const statusVariant =
              proposal.status === "OPEN"
                ? "info"
                : proposal.status === "UNDER_REVIEW"
                  ? "warning"
                  : proposal.status === "ACCEPTED"
                    ? "success"
                    : proposal.status === "REJECTED"
                      ? "danger"
                      : "default";
            return (
              <Card key={proposal.id} padding="sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{proposal.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      {proposal.policy.party && (
                        <span className="flex items-center gap-1">
                          {proposal.policy.party.color && (
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: proposal.policy.party.color }}
                            />
                          )}
                          {proposal.policy.party.name}
                        </span>
                      )}
                      <span>{proposal.policy.title}</span>
                      <span>{new Date(proposal.createdAt).toLocaleDateString("ja-JP")}</span>
                    </div>
                    {proposal.gitPrUrl && (
                      <a
                        href={proposal.gitPrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-green-600 hover:underline"
                      >
                        GitHub PR を見る
                      </a>
                    )}
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
    </div>
  );
}
