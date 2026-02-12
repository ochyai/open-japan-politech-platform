import { prisma } from "@ojpp/db";
import { Badge, Card } from "@ojpp/ui";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    party?: string;
    chamber?: string;
    page?: string;
  }>;
}

const CHAMBER_LABELS: Record<string, string> = {
  HOUSE_OF_REPRESENTATIVES: "衆議院",
  HOUSE_OF_COUNCILLORS: "参議院",
};

export default async function PoliticiansPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 30;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.party) where.partyId = params.party;
  if (params.chamber) where.chamber = params.chamber;

  const [politicians, total, parties] = await Promise.all([
    prisma.politician.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        party: true,
        prefecture: true,
        _count: { select: { votes: true } },
      },
    }),
    prisma.politician.count({ where }),
    prisma.party.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-bold">議員名簿</h2>

      <div className="mb-6 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">議院</label>
          <div className="flex gap-1">
            <a
              href={`/politicians?party=${params.party ?? ""}&chamber=`}
              className={`rounded-full px-3 py-1 text-sm ${
                !params.chamber
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              すべて
            </a>
            <a
              href={`/politicians?party=${params.party ?? ""}&chamber=HOUSE_OF_REPRESENTATIVES`}
              className={`rounded-full px-3 py-1 text-sm ${
                params.chamber === "HOUSE_OF_REPRESENTATIVES"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              衆議院
            </a>
            <a
              href={`/politicians?party=${params.party ?? ""}&chamber=HOUSE_OF_COUNCILLORS`}
              className={`rounded-full px-3 py-1 text-sm ${
                params.chamber === "HOUSE_OF_COUNCILLORS"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              参議院
            </a>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">政党</label>
          <div className="flex flex-wrap gap-1">
            <a
              href={`/politicians?party=&chamber=${params.chamber ?? ""}`}
              className={`rounded-full px-3 py-1 text-sm ${
                !params.party
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              すべて
            </a>
            {parties.map((p) => (
              <a
                key={p.id}
                href={`/politicians?party=${p.id}&chamber=${params.chamber ?? ""}`}
                className={`rounded-full px-3 py-1 text-sm ${
                  params.party === p.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p.shortName ?? p.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500">{total}名の議員</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {politicians.map((pol) => (
          <a key={pol.id} href={`/politicians/${pol.id}`}>
            <Card padding="sm" className="transition-colors hover:border-purple-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                  {pol.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{pol.name}</span>
                    {pol.chamber && (
                      <Badge variant="info">{CHAMBER_LABELS[pol.chamber] ?? pol.chamber}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {pol.party && <span>{pol.party.shortName ?? pol.party.name}</span>}
                    {pol.district && <span>{pol.district}</span>}
                  </div>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={`/politicians?party=${params.party ?? ""}&chamber=${params.chamber ?? ""}&page=${page - 1}`}
              className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
            >
              前へ
            </a>
          )}
          <span className="px-4 py-2 text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/politicians?party=${params.party ?? ""}&chamber=${params.chamber ?? ""}&page=${page + 1}`}
              className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
            >
              次へ
            </a>
          )}
        </div>
      )}
    </div>
  );
}
