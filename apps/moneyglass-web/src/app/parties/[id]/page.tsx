import { notFound } from "next/navigation";
import { Card, Stat } from "@ojpp/ui";
import { formatCurrency } from "@/lib/format";
import { PartyDetailCharts } from "./party-detail-charts";

interface PartyDetail {
  id: string;
  name: string;
  shortName: string | null;
  color: string | null;
  website: string | null;
  organizations: {
    id: string;
    name: string;
    type: string;
    fundReports: {
      id: string;
      fiscalYear: number;
      totalIncome: string;
      totalExpenditure: string;
    }[];
  }[];
}

async function getParty(id: string): Promise<PartyDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/organizations?party=${id}&limit=100`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const result = await res.json();

  if (result.data.length === 0) return null;

  const party = result.data[0].party;
  return {
    id: party.id,
    name: party.name,
    shortName: party.shortName,
    color: party.color,
    website: party.website,
    organizations: result.data.map((org: Record<string, unknown>) => ({
      id: org.id,
      name: org.name,
      type: org.type,
      fundReports: [],
    })),
  };
}

async function getPartyReports(partyId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/reports?limit=100`, { cache: "no-store" });
  if (!res.ok) return [];
  const result = await res.json();
  return result.data.filter(
    (r: { organization: { party: { id: string } | null } }) =>
      r.organization?.party?.id === partyId,
  );
}

const ORG_TYPE_LABELS: Record<string, string> = {
  PARTY_BRANCH: "政党支部",
  FUND_MANAGEMENT: "資金管理団体",
};

export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [party, reports] = await Promise.all([getParty(id), getPartyReports(id)]);

  if (!party) notFound();

  // Aggregate yearly stats
  const yearlyMap = new Map<number, { income: number; expenditure: number }>();
  for (const report of reports) {
    const year = report.fiscalYear;
    const current = yearlyMap.get(year) ?? { income: 0, expenditure: 0 };
    current.income += Number(report.totalIncome);
    current.expenditure += Number(report.totalExpenditure);
    yearlyMap.set(year, current);
  }
  const yearlyStats = Array.from(yearlyMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, vals]) => ({
      year,
      totalIncome: vals.income,
      totalExpenditure: vals.expenditure,
    }));

  let totalIncome = 0;
  let totalExpenditure = 0;
  for (const r of reports) {
    totalIncome += Number(r.totalIncome);
    totalExpenditure += Number(r.totalExpenditure);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center gap-4">
        <div
          className="h-6 w-6 rounded-full"
          style={{ backgroundColor: party.color ?? "#6B7280" }}
        />
        <h2 className="text-3xl font-bold">{party.name}</h2>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="所属団体数" value={String(party.organizations.length)} />
        <Stat label="総収入（全年度合計）" value={formatCurrency(totalIncome)} />
        <Stat label="総支出（全年度合計）" value={formatCurrency(totalExpenditure)} />
      </div>

      {yearlyStats.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-4 text-xl font-bold">年度別資金推移</h3>
          <Card>
            <PartyDetailCharts yearlyStats={yearlyStats} />
          </Card>
        </section>
      )}

      <section>
        <h3 className="mb-4 text-xl font-bold">所属団体一覧</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {party.organizations.map((org) => (
            <a key={org.id} href={`/organizations/${org.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <h4 className="font-semibold">{org.name}</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {ORG_TYPE_LABELS[org.type] ?? org.type}
                </p>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
