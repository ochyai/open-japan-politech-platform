import { notFound } from "next/navigation";
import { Card, Badge, Stat } from "@ojpp/ui";
import { formatCurrency } from "@/lib/format";
import { ReportCharts } from "./report-charts";

const INCOME_CATEGORY_LABELS: Record<string, string> = {
  PARTY_FEE: "党費",
  DONATION_INDIVIDUAL: "個人寄附",
  DONATION_CORPORATE: "法人寄附",
  DONATION_POLITICAL: "政治団体寄附",
  PARTY_SUBSIDY: "政党交付金",
  FUNDRAISING_EVENT: "政治資金パーティー",
  BUSINESS_INCOME: "事業収入",
  OTHER_INCOME: "その他",
  CARRY_FORWARD: "前年繰越",
};

const EXPENDITURE_CATEGORY_LABELS: Record<string, string> = {
  PERSONNEL: "人件費",
  OFFICE: "事務所費",
  EQUIPMENT: "備品・消耗品費",
  PRINTING: "機関紙誌発行",
  PUBLICITY: "宣伝事業費",
  POLITICAL_ACTIVITY: "政治活動費",
  DONATION_OUT: "寄附・交付金",
  OTHER_EXPENSE: "その他経費",
};

interface ReportDetail {
  id: string;
  fiscalYear: number;
  reportingBody: string;
  totalIncome: string;
  totalExpenditure: string;
  balance: string;
  status: string;
  organization: {
    id: string;
    name: string;
    party: { name: string; color: string | null } | null;
  };
  incomes: { id: string; category: string; source: string | null; amount: string; description: string | null }[];
  expenditures: { id: string; category: string; recipient: string | null; amount: string; description: string | null }[];
}

async function getReport(id: string): Promise<ReportDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/reports/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.json();
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  const incomeData = report.incomes.map((i) => ({
    name: INCOME_CATEGORY_LABELS[i.category] ?? i.category,
    value: Number(i.amount),
  }));

  const expenditureData = report.expenditures.map((e) => ({
    name: EXPENDITURE_CATEGORY_LABELS[e.category] ?? e.category,
    value: Number(e.amount),
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-2 text-sm text-gray-500">
        <a href={`/organizations/${report.organization.id}`} className="hover:underline">
          {report.organization.name}
        </a>
        {" > "}
        {report.fiscalYear}年度 収支報告書
      </div>

      <div className="mb-8 flex items-center gap-3">
        <h2 className="text-3xl font-bold">
          {report.fiscalYear}年度 収支報告書
        </h2>
        <Badge variant={report.status === "PUBLISHED" ? "success" : "default"}>
          {report.status}
        </Badge>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Stat label="総収入" value={formatCurrency(report.totalIncome)} />
        <Stat label="総支出" value={formatCurrency(report.totalExpenditure)} />
        <Stat label="残高" value={formatCurrency(report.balance)} />
        <Stat label="届出先" value={report.reportingBody} />
      </div>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h3 className="mb-4 text-xl font-bold">収入内訳</h3>
          <Card>
            <ReportCharts type="income" data={incomeData} />
          </Card>
          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">区分</th>
                  <th className="px-4 py-3 text-right font-medium">金額</th>
                </tr>
              </thead>
              <tbody>
                {report.incomes.map((income) => (
                  <tr key={income.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {INCOME_CATEGORY_LABELS[income.category] ?? income.category}
                      {income.source && (
                        <span className="ml-2 text-xs text-gray-400">({income.source})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(income.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-xl font-bold">支出内訳</h3>
          <Card>
            <ReportCharts type="expenditure" data={expenditureData} />
          </Card>
          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">区分</th>
                  <th className="px-4 py-3 text-right font-medium">金額</th>
                </tr>
              </thead>
              <tbody>
                {report.expenditures.map((exp) => (
                  <tr key={exp.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {EXPENDITURE_CATEGORY_LABELS[exp.category] ?? exp.category}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
