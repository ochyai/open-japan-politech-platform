import { notFound } from "next/navigation";
import { Card, Badge } from "@ojpp/ui";
import { formatCurrency } from "@/lib/format";

const ORG_TYPE_LABELS: Record<string, string> = {
  PARTY_BRANCH: "政党支部",
  FUND_MANAGEMENT: "資金管理団体",
  SUPPORT_GROUP: "後援会",
  POLITICAL_COMMITTEE: "政治資金委員会",
  OTHER: "その他",
};

interface OrgDetail {
  id: string;
  name: string;
  type: string;
  address: string | null;
  representative: string | null;
  treasurer: string | null;
  party: { id: string; name: string; shortName: string | null; color: string | null } | null;
  fundReports: {
    id: string;
    fiscalYear: number;
    totalIncome: string;
    totalExpenditure: string;
    balance: string;
    status: string;
  }[];
}

async function getOrganization(id: string): Promise<OrgDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/organizations/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch organization");
  return res.json();
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrganization(id);
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">{org.name}</h2>
          {org.party && (
            <span
              className="rounded-full px-3 py-1 text-sm font-medium text-white"
              style={{ backgroundColor: org.party.color ?? "#6B7280" }}
            >
              {org.party.name}
            </span>
          )}
        </div>
        <Badge>{ORG_TYPE_LABELS[org.type] ?? org.type}</Badge>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">住所</p>
          <p className="mt-1 font-medium">{org.address ?? "-"}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">代表者</p>
          <p className="mt-1 font-medium">{org.representative ?? "-"}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">会計責任者</p>
          <p className="mt-1 font-medium">{org.treasurer ?? "-"}</p>
        </Card>
      </div>

      <section>
        <h3 className="mb-4 text-xl font-bold">収支報告書一覧</h3>
        {org.fundReports.length === 0 ? (
          <p className="text-gray-500">報告書がありません</p>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">年度</th>
                  <th className="px-4 py-3 text-right font-medium">収入</th>
                  <th className="px-4 py-3 text-right font-medium">支出</th>
                  <th className="px-4 py-3 text-right font-medium">残高</th>
                  <th className="px-4 py-3 font-medium">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {org.fundReports.map((report) => (
                  <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <a href={`/reports/${report.id}`} className="text-blue-600 hover:underline">
                        {report.fiscalYear}年
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(report.totalIncome)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(report.totalExpenditure)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(report.balance)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={report.status === "PUBLISHED" ? "success" : "default"}>
                        {report.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
