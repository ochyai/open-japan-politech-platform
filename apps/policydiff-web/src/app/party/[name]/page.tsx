import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { PolicyCard } from "@/components/policy-card";
import { Badge } from "@ojpp/ui";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function PartyPage({ params }: Props) {
  const { name } = await params;
  const partyName = decodeURIComponent(name);

  const party = await prisma.party.findUnique({
    where: { name: partyName },
    include: {
      policies: {
        orderBy: { category: "asc" },
      },
    },
  });

  if (!party) {
    notFound();
  }

  const categoriesMap = new Map<string, typeof party.policies>();
  for (const policy of party.policies) {
    const existing = categoriesMap.get(policy.category) ?? [];
    existing.push(policy);
    categoriesMap.set(policy.category, existing);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div
        className="mb-8 rounded-lg border-l-4 bg-white p-6"
        style={{ borderLeftColor: party.color ?? "#6b7280" }}
      >
        <div className="flex items-center gap-3">
          {party.color && (
            <span
              className="inline-block h-4 w-4 rounded-full"
              style={{ backgroundColor: party.color }}
            />
          )}
          <h2 className="text-3xl font-bold">{party.name}</h2>
          {party.shortName && (
            <Badge>{party.shortName}</Badge>
          )}
        </div>
        <p className="mt-2 text-gray-600">
          登録政策数: {party.policies.length}件
        </p>
        {party.website && (
          <a
            href={party.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-green-600 hover:underline"
          >
            公式サイト
          </a>
        )}
      </div>

      {Array.from(categoriesMap.entries()).map(([category, policies]) => (
        <section key={category} className="mb-8">
          <h3 className="mb-4 text-xl font-bold">{category}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                id={policy.id}
                title={policy.title}
                category={policy.category}
                partyName={party.name}
                partyColor={party.color}
                status={policy.status}
                contentPreview={policy.content.slice(0, 100).replace(/[#*\n]/g, " ").trim()}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
