import { Card } from "@ojpp/ui";
import { formatCurrency } from "@/lib/format";

interface PartyData {
  id: string;
  name: string;
  shortName: string | null;
  color: string | null;
  organizationCount: number;
  totalIncome: string;
  totalExpenditure: string;
}

async function getParties(): Promise<PartyData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/parties`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch parties");
  return res.json();
}

export default async function PartiesPage() {
  let parties: PartyData[] = [];
  try {
    parties = await getParties();
  } catch {
    // fallback
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold">政党別資金集計</h2>
      <p className="mb-8 text-gray-600">
        各政党の政治団体における資金の総計を比較
      </p>

      {parties.length === 0 ? (
        <p className="text-center text-gray-500">データがありません</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {parties
            .sort((a, b) => Number(b.totalIncome) - Number(a.totalIncome))
            .map((party) => (
              <a key={party.id} href={`/parties/${party.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: party.color ?? "#6B7280" }}
                    />
                    <h3 className="text-lg font-bold">{party.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">団体数</span>
                      <span className="font-medium">{party.organizationCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">総収入</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(party.totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">総支出</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(party.totalExpenditure)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: party.color ?? "#6B7280",
                          width: `${Math.min(100, (Number(party.totalExpenditure) / Math.max(1, Number(party.totalIncome))) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">支出/収入比率</p>
                  </div>
                </Card>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
