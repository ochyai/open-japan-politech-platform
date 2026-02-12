import { prisma } from "@ojpp/db";
import { BillCard } from "@/components/bill-card";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    sessionId?: string;
    category?: string;
    page?: string;
  }>;
}

const STATUSES = [
  { value: "", label: "すべて" },
  { value: "ENACTED", label: "成立" },
  { value: "COMMITTEE", label: "委員会審議中" },
  { value: "SUBMITTED", label: "提出" },
  { value: "REJECTED", label: "否決" },
  { value: "WITHDRAWN", label: "撤回" },
];

export default async function BillsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.sessionId) where.sessionId = params.sessionId;
  if (params.category) where.category = params.category;

  const [bills, total, sessions, categories] = await Promise.all([
    prisma.bill.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: "desc" },
      include: { session: true },
    }),
    prisma.bill.count({ where }),
    prisma.dietSession.findMany({ orderBy: { number: "desc" } }),
    prisma.bill.groupBy({ by: ["category"], where: { category: { not: null } } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-bold">法案一覧</h2>

      <div className="mb-6 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">ステータス</label>
          <div className="flex flex-wrap gap-1">
            {STATUSES.map((s) => (
              <a
                key={s.value}
                href={`/bills?status=${s.value}&sessionId=${params.sessionId ?? ""}&category=${params.category ?? ""}`}
                className={`rounded-full px-3 py-1 text-sm ${
                  (params.status ?? "") === s.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">会期</label>
          <div className="flex flex-wrap gap-1">
            <a
              href={`/bills?status=${params.status ?? ""}&sessionId=&category=${params.category ?? ""}`}
              className={`rounded-full px-3 py-1 text-sm ${
                !params.sessionId
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              すべて
            </a>
            {sessions.slice(0, 5).map((s) => (
              <a
                key={s.id}
                href={`/bills?status=${params.status ?? ""}&sessionId=${s.id}&category=${params.category ?? ""}`}
                className={`rounded-full px-3 py-1 text-sm ${
                  params.sessionId === s.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                第{s.number}回
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500">{total}件の法案</p>

      <div className="space-y-3">
        {bills.map((bill) => (
          <BillCard
            key={bill.id}
            id={bill.id}
            number={bill.number}
            title={bill.title}
            summary={bill.summary}
            proposer={bill.proposer}
            category={bill.category}
            status={bill.status}
            submittedAt={bill.submittedAt?.toISOString() ?? null}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={`/bills?status=${params.status ?? ""}&sessionId=${params.sessionId ?? ""}&category=${params.category ?? ""}&page=${page - 1}`}
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
              href={`/bills?status=${params.status ?? ""}&sessionId=${params.sessionId ?? ""}&category=${params.category ?? ""}&page=${page + 1}`}
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
