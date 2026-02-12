import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { PolicyCard } from "@/components/policy-card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  const policies = await prisma.policy.findMany({
    where: { category: categoryName },
    include: { party: true },
    orderBy: { party: { name: "asc" } },
  });

  if (policies.length === 0) {
    notFound();
  }

  const allCategories = await prisma.policy.groupBy({
    by: ["category"],
    orderBy: { category: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold">{categoryName}</h2>
        <p className="text-gray-600">
          全{policies.length}政党の「{categoryName}」に関する政策を一覧で比較できます。
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <a
            key={cat.category}
            href={`/category/${encodeURIComponent(cat.category)}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              cat.category === categoryName
                ? "border-green-600 bg-green-50 font-medium text-green-700"
                : "hover:bg-gray-50"
            }`}
          >
            {cat.category}
          </a>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            id={policy.id}
            title={policy.title}
            category={policy.category}
            partyName={policy.party?.name}
            partyColor={policy.party?.color}
            status={policy.status}
            contentPreview={policy.content.slice(0, 100).replace(/[#*\n]/g, " ").trim()}
          />
        ))}
      </div>
    </div>
  );
}
