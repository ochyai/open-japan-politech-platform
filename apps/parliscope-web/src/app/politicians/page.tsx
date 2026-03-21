import { prisma } from "@ojpp/db";
import { PoliticianGridAnimated } from "./politician-grid-animated";

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

/** Party color map - major Japanese political parties */
const PARTY_COLORS: Record<string, { gradient: string; border: string; text: string }> = {
  自由民主党: {
    gradient: "from-blue-500 to-blue-700",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  自民党: {
    gradient: "from-blue-500 to-blue-700",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  立憲民主党: {
    gradient: "from-blue-400 to-cyan-600",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
  },
  公明党: {
    gradient: "from-orange-400 to-red-500",
    border: "border-orange-500/30",
    text: "text-orange-400",
  },
  日本維新の会: {
    gradient: "from-green-400 to-emerald-600",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  維新: {
    gradient: "from-green-400 to-emerald-600",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  国民民主党: {
    gradient: "from-yellow-400 to-amber-600",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  },
  日本共産党: {
    gradient: "from-red-500 to-rose-700",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  共産党: {
    gradient: "from-red-500 to-rose-700",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  れいわ新選組: {
    gradient: "from-pink-400 to-rose-600",
    border: "border-pink-500/30",
    text: "text-pink-400",
  },
  社民党: {
    gradient: "from-blue-300 to-indigo-500",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
  },
  参政党: {
    gradient: "from-amber-400 to-orange-600",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
};

const DEFAULT_PARTY_COLOR = {
  gradient: "from-violet-500 to-indigo-600",
  border: "border-violet-500/30",
  text: "text-violet-400",
};

function getPartyColor(partyName: string | undefined) {
  if (!partyName) return DEFAULT_PARTY_COLOR;
  for (const [key, value] of Object.entries(PARTY_COLORS)) {
    if (partyName.includes(key)) return value;
  }
  return DEFAULT_PARTY_COLOR;
}

export default async function PoliticiansPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 32;
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">議員名簿</h2>
          <p className="text-[#8b949e]">国会議員のプロフィールと投票データを閲覧できます</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              議院
            </span>
            <div className="flex gap-2">
              <a
                href={`/politicians?party=${params.party ?? ""}&chamber=`}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  !params.chamber
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                すべて
              </a>
              <a
                href={`/politicians?party=${params.party ?? ""}&chamber=HOUSE_OF_REPRESENTATIVES`}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  params.chamber === "HOUSE_OF_REPRESENTATIVES"
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                衆議院
              </a>
              <a
                href={`/politicians?party=${params.party ?? ""}&chamber=HOUSE_OF_COUNCILLORS`}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  params.chamber === "HOUSE_OF_COUNCILLORS"
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                参議院
              </a>
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              政党
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={`/politicians?party=&chamber=${params.chamber ?? ""}`}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  !params.party
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                すべて
              </a>
              {parties.map((p) => (
                <a
                  key={p.id}
                  href={`/politicians?party=${p.id}&chamber=${params.chamber ?? ""}`}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    params.party === p.id
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {p.shortName ?? p.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-[#6b7280]">{total}名の議員</p>

        <PoliticianGridAnimated>
          {politicians.map((pol) => {
            const partyColor = getPartyColor(pol.party?.name);
            return (
              <a key={pol.id} href={`/politicians/${pol.id}`} className="group block">
                <div
                  className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 ${partyColor.border}`}
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${partyColor.gradient} opacity-60`}
                  />
                  <div className="flex items-center gap-3">
                    {pol.imageUrl ? (
                      <img
                        src={pol.imageUrl}
                        alt={pol.name}
                        className="h-11 w-11 shrink-0 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${partyColor.gradient} text-sm font-bold text-white shadow-lg`}
                      >
                        {pol.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {pol.name}
                        </span>
                        {pol.chamber && (
                          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#8b949e]">
                            {CHAMBER_LABELS[pol.chamber] ?? pol.chamber}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs">
                        {pol.party && (
                          <span className={`font-medium ${partyColor.text}`}>
                            {pol.party.shortName ?? pol.party.name}
                          </span>
                        )}
                        {pol.district && <span className="text-[#6b7280]">{pol.district}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </PoliticianGridAnimated>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <a
                href={`/politicians?party=${params.party ?? ""}&chamber=${params.chamber ?? ""}&page=${page - 1}`}
                className="rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm text-[#8b949e] transition-all hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
              >
                前へ
              </a>
            )}
            <span className="px-4 py-2 text-sm text-[#6b7280]">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`/politicians?party=${params.party ?? ""}&chamber=${params.chamber ?? ""}&page=${page + 1}`}
                className="rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm text-[#8b949e] transition-all hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
              >
                次へ
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
