import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { Badge, Card } from "@ojpp/ui";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PartyChip } from "@/components/party-chip";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PolicyPage({ params }: Props) {
  const { id } = await params;

  const policy = await prisma.policy.findUnique({
    where: { id },
    include: {
      party: true,
      proposals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!policy) {
    notFound();
  }

  const statusVariant = policy.status === "PUBLISHED"
    ? "success"
    : policy.status === "DRAFT"
      ? "warning"
      : "default";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Badge variant="info">{policy.category}</Badge>
          <Badge variant={statusVariant}>{policy.status}</Badge>
          {policy.party && (
            <PartyChip
              name={policy.party.name}
              color={policy.party.color}
              href={`/party/${encodeURIComponent(policy.party.name)}`}
            />
          )}
        </div>
        <h2 className="text-3xl font-bold">{policy.title}</h2>
        {policy.publishedAt && (
          <p className="mt-2 text-sm text-gray-500">
            公開日: {new Date(policy.publishedAt).toLocaleDateString("ja-JP")}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <MarkdownRenderer content={policy.content} />
          </Card>
        </div>

        <div className="space-y-6">
          {policy.party && (
            <Card padding="sm">
              <h3 className="mb-3 text-sm font-bold text-gray-500">政党情報</h3>
              <div className="flex items-center gap-2">
                {policy.party.color && (
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: policy.party.color }}
                  />
                )}
                <a
                  href={`/party/${encodeURIComponent(policy.party.name)}`}
                  className="font-medium hover:text-green-600"
                >
                  {policy.party.name}
                </a>
              </div>
            </Card>
          )}

          <Card padding="sm">
            <h3 className="mb-3 text-sm font-bold text-gray-500">メタデータ</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">バージョン</dt>
                <dd className="font-medium">v{policy.version}</dd>
              </div>
              {policy.gitRef && (
                <div>
                  <dt className="text-gray-500">Git Ref</dt>
                  <dd className="font-mono text-xs">{policy.gitRef}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card padding="sm">
            <h3 className="mb-3 text-sm font-bold text-gray-500">
              変更提案 ({policy.proposals.length}件)
            </h3>
            {policy.proposals.length > 0 ? (
              <div className="space-y-2">
                {policy.proposals.map((proposal) => {
                  const proposalVariant =
                    proposal.status === "OPEN"
                      ? "info"
                      : proposal.status === "ACCEPTED"
                        ? "success"
                        : proposal.status === "REJECTED"
                          ? "danger"
                          : "default";
                  return (
                    <div key={proposal.id} className="rounded border p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{proposal.title}</span>
                        <Badge variant={proposalVariant}>{proposal.status}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {proposal.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">まだ変更提案はありません。</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
