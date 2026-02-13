import { prisma } from "@ojpp/db";
import { FadeIn, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { DonutChart } from "./donut-chart";
import { StackedBarChart } from "./stacked-bar-chart";
import { DarkStatCard } from "./dark-stat-card";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface BudgetRow {
  id: string;
  fiscalYear: number;
  category: string;
  amount: bigint;
  description: string | null;
}

interface ProgramRow {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string | null;
  benefit: string | null;
  budget: bigint | null;
  recipients: number | null;
  isActive: boolean;
}

/* ---------- Helpers ---------- */

const CATEGORY_LABELS: Record<string, string> = {
  PENSION: "年金",
  HEALTHCARE: "医療",
  LONG_TERM_CARE: "介護",
  WELFARE: "福祉",
  CHILD_SUPPORT: "子育て支援",
  EMPLOYMENT: "雇用・労働",
  DISABILITY: "障害福祉",
  TOTAL: "合計",
};

const CATEGORY_COLORS: Record<string, string> = {
  PENSION: "#059669",
  HEALTHCARE: "#10B981",
  LONG_TERM_CARE: "#34D399",
  WELFARE: "#6EE7B7",
  CHILD_SUPPORT: "#A7F3D0",
  EMPLOYMENT: "#D1FAE5",
  DISABILITY: "#ECFDF5",
};

function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat;
}

function formatAmount(amount: bigint): string {
  const num = Number(amount);
  if (num >= 10000) return `${(num / 10000).toFixed(1)}兆円`;
  return `${num.toLocaleString()}億円`;
}

/* ---------- Data Fetching ---------- */

async function getData() {
  noStore();
  const [budgets, programs] = await Promise.all([
    prisma.socialSecurityBudget.findMany({ orderBy: { fiscalYear: "desc" } }),
    prisma.socialSecurityProgram.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { budgets: budgets as unknown as BudgetRow[], programs: programs as unknown as ProgramRow[] };
}

/* ---------- Main Page ---------- */

export default async function Home() {
  let budgets: BudgetRow[] = [];
  let programs: ProgramRow[] = [];
  let fetchError: string | null = null;

  try {
    const data = await getData();
    budgets = data.budgets;
    programs = data.programs;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[SocialGuard] Failed to fetch data:", msg);
    fetchError = msg;
  }

  /* --- Compute stats --- */
  const latestYear = budgets.length > 0 ? Math.max(...budgets.map((b) => b.fiscalYear)) : null;
  const latestBudgets = latestYear ? budgets.filter((b) => b.fiscalYear === latestYear) : [];
  const totalBudget = latestBudgets.find((b) => b.category === "TOTAL");
  const categoryBudgets = latestBudgets.filter((b) => b.category !== "TOTAL");
  const activePrograms = programs.filter((p) => p.isActive);
  // 1人あたり社会保障費を算出（延べ受給者数は重複カウントのため使わない）
  const JAPAN_POP = 12_400; // 万人（2026年推計）
  const perCapita = totalBudget ? Math.round(Number(totalBudget.amount) / JAPAN_POP) : null;

  /* --- Donut chart data --- */
  const donutSegments = categoryBudgets
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .map((b) => ({
      label: categoryLabel(b.category),
      value: Number(b.amount),
      color: CATEGORY_COLORS[b.category] ?? "#6B7280",
    }));

  /* --- Stacked bar chart data (year-over-year) --- */
  const allYears = [...new Set(budgets.map((b) => b.fiscalYear))].sort();
  const categories = [...new Set(budgets.filter((b) => b.category !== "TOTAL").map((b) => b.category))];
  const yearBarData = allYears.map((year) => {
    const yearBudgets = budgets.filter((b) => b.fiscalYear === year && b.category !== "TOTAL");
    const yearTotal = budgets.find((b) => b.fiscalYear === year && b.category === "TOTAL");
    const segments = categories.map((cat) => {
      const entry = yearBudgets.find((b) => b.category === cat);
      return {
        label: categoryLabel(cat),
        value: entry ? Number(entry.amount) : 0,
        color: CATEGORY_COLORS[cat] ?? "#6B7280",
      };
    });
    return {
      year,
      segments,
      total: yearTotal ? Number(yearTotal.amount) : segments.reduce((s, seg) => s + seg.value, 0),
    };
  });
  const maxYearTotal = Math.max(...yearBarData.map((d) => d.total), 1);

  // Compute year-over-year change
  let changePercent: string | undefined;
  if (yearBarData.length >= 2) {
    const latest = yearBarData[yearBarData.length - 1].total;
    const firstYear = yearBarData[0].total;
    if (firstYear > 0) {
      const pct = ((latest - firstYear) / firstYear) * 100;
      changePercent = `${pct > 0 ? "+" : ""}${pct.toFixed(0)}%`;
    }
  }

  /* --- GDP ratio estimate --- */
  const gdpRatio = totalBudget ? ((Number(totalBudget.amount) / 10000 / 560) * 100).toFixed(1) : null;

  /* --- Empty state --- */
  if (budgets.length === 0 && programs.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-slate-950 py-20 pb-24">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative mx-auto max-w-7xl px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              社会保障の全体像を、ひと目で
            </h1>
            <p className="mt-3 max-w-2xl text-gray-400">
              年金・医療・介護・子育て・福祉 -- 40兆円規模の社会保障を可視化
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="dark-card p-8">
            {fetchError ? (
              <div className="text-center">
                <p className="text-red-400 font-medium">データベース接続エラー</p>
                <p className="mt-2 text-sm text-gray-500">
                  PostgreSQLに接続できませんでした。Supabaseコンテナが起動しているか確認してください。
                </p>
                <code className="mt-2 inline-block rounded bg-red-950/50 px-3 py-1 text-xs font-mono text-red-400">
                  {fetchError}
                </code>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                社会保障データがまだ投入されていません。
                <br />
                <code className="mt-1 inline-block rounded bg-slate-800 px-2 py-1 text-xs font-mono text-gray-400">
                  pnpm ingest:social-security
                </code>{" "}
                を実行してデータを投入してください。
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ====== Dark Hero Section ====== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-slate-950 py-16 pb-20">
        {/* Parallax dot grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-8">
          <FadeIn>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              社会保障の全体像を、ひと目で
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mb-8 max-w-2xl text-sm text-gray-400">
              年金・医療・介護・子育て・福祉 -- 40兆円規模の社会保障を可視化
            </p>
          </FadeIn>

          {/* ====== Stats Cards Row ====== */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <DarkStatCard
              label={latestYear ? `${latestYear}年度総額` : "総額"}
              value={totalBudget ? `\u00A5${(Number(totalBudget.amount) / 10000).toFixed(1)}兆` : "-"}
              index={0}
            />
            <DarkStatCard
              label="対象制度"
              value={`${activePrograms.length}制度`}
              index={1}
            />
            <DarkStatCard
              label="国民1人あたり"
              value={perCapita ? `${perCapita.toLocaleString()}万円` : "-"}
              index={2}
            />
            <DarkStatCard
              label="対GDP比"
              value={gdpRatio ? `${gdpRatio}%` : "-"}
              index={3}
            />
            <DarkStatCard
              label="都道府県"
              value="47"
              index={4}
            />
          </div>
        </div>
      </section>

      {/* ====== Main Content ====== */}
      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* ====== Charts Row: Donut + Stacked Bar ====== */}
        <FadeIn>
          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Donut Chart */}
            {donutSegments.length > 0 && (
              <div className="dark-card p-8">
                <h2 className="mb-6 text-base font-semibold text-white">
                  分野別構成（{latestYear}）
                </h2>
                <DonutChart
                  segments={donutSegments}
                  total={totalBudget ? Number(totalBudget.amount) : 1}
                  centerLabel={totalBudget ? `${(Number(totalBudget.amount) / 10000).toFixed(1)}兆` : "-"}
                  centerSub={latestYear ? `${latestYear}年度` : ""}
                />
              </div>
            )}

            {/* Stacked Bar Chart */}
            {yearBarData.length > 0 && (
              <div className="dark-card p-8">
                <h2 className="mb-6 text-base font-semibold text-white">
                  社会保障費推移（兆円）
                </h2>
                <StackedBarChart
                  data={yearBarData}
                  maxValue={maxYearTotal}
                  latestTotal={totalBudget ? `${(Number(totalBudget.amount) / 10000).toFixed(1)}兆` : undefined}
                  changePercent={changePercent}
                />
              </div>
            )}
          </div>
        </FadeIn>

        {/* ====== Category Budget Cards ====== */}
        {categoryBudgets.length > 0 && (
          <FadeIn delay={0.1}>
            <section className="mb-10">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
                <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                分野別予算
              </h2>
              <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBudgets
                  .sort((a, b) => Number(b.amount) - Number(a.amount))
                  .map((b) => (
                    <StaggerItem key={b.id}>
                      <div className="dark-card p-6 transition-all duration-300 hover:bg-white/[0.05]">
                        <div className="flex items-start justify-between">
                          <div>
                            <span
                              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                              style={{ backgroundColor: CATEGORY_COLORS[b.category] ?? "#6B7280" }}
                            >
                              {categoryLabel(b.category)}
                            </span>
                            <p className="mt-3 text-2xl font-bold tracking-tight text-white">
                              {formatAmount(b.amount)}
                            </p>
                            {b.description && (
                              <p className="mt-1 text-sm text-gray-500">{b.description}</p>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-400">
                            {totalBudget && (
                              <span className="text-lg font-semibold text-emerald-400">
                                {((Number(b.amount) / Number(totalBudget.amount)) * 100).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
              </StaggerGrid>
            </section>
          </FadeIn>
        )}

        {/* ====== Programs Highlight ====== */}
        {activePrograms.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                  <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                  主要制度
                </h2>
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  すべて見る
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
              <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activePrograms.slice(0, 6).map((p) => (
                  <StaggerItem key={p.id}>
                    <div className="dark-card p-6 h-full transition-all duration-300 hover:bg-white/[0.05]">
                      <div className="flex flex-col h-full">
                        <div className="mb-3">
                          <span
                            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                            style={{ backgroundColor: CATEGORY_COLORS[p.category] ?? "#6B7280" }}
                          >
                            {categoryLabel(p.category)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">{p.name}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-3">
                          {p.description}
                        </p>
                        <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3 text-xs text-gray-500">
                          {p.recipients != null && (
                            <span>受給者: 約{p.recipients.toLocaleString()}万人</span>
                          )}
                          {p.budget != null && (
                            <span>予算: {formatAmount(p.budget)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </section>
          </FadeIn>
        )}

        {/* ====== Quick Links ====== */}
        <FadeIn delay={0.3}>
          <section className="mb-8">
            <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StaggerItem>
                <Link href="/budget" className="block">
                  <div className="dark-card p-6 text-center transition-all duration-300 hover:bg-white/[0.05] group">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-white">予算推移</h3>
                    <p className="mt-1 text-sm text-gray-500">年度別の予算推移を可視化</p>
                  </div>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/prefectures" className="block">
                  <div className="dark-card p-6 text-center transition-all duration-300 hover:bg-white/[0.05] group">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-900/40 text-teal-400 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-white">都道府県比較</h3>
                    <p className="mt-1 text-sm text-gray-500">地域ごとの福祉データを比較</p>
                  </div>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/compare" className="block">
                  <div className="dark-card p-6 text-center transition-all duration-300 hover:bg-white/[0.05] group">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-900/40 text-cyan-400 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-white">政党比較</h3>
                    <p className="mt-1 text-sm text-gray-500">社会保障への各党スタンス</p>
                  </div>
                </Link>
              </StaggerItem>
            </StaggerGrid>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
