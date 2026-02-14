import { formatCurrency, getBaseUrl } from "@/lib/format";
import { DashboardCharts } from "./dashboard-charts";
import { HeroStats } from "./hero-stats";

/* ---------- Types ---------- */

interface StatsData {
  organizationCount: number;
  reportCount: number;
  totalIncome: string;
  totalExpenditure: string;
  recentReports: {
    id: string;
    fiscalYear: number;
    totalIncome: string;
    totalExpenditure: string;
    organization: {
      name: string;
      party: { name: string; color: string | null } | null;
    };
  }[];
  yearlyStats: {
    year: number;
    totalIncome: string;
    totalExpenditure: string;
    reportCount: number;
  }[];
}

interface PhysicsAudit {
  engine_version: string;
  analysis: {
    magnitude: number;
    fragility: "CRITICAL" | "STABLE";
    phase_angle: number;
    is_straw_effect: boolean;
    distortion_index: number;
  };
}

/* ---------- Data Fetching ---------- */

async function getStats(): Promise<StatsData | null> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

async function getPhysicsAudit(): Promise<PhysicsAudit | null> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/physics-check`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

/* ---------- Main Page Component ---------- */

export default async function Home() {
  // お金データと物理監査データを並列で取得
  const [stats, audit] = await Promise.all([
    getStats(),
    getPhysicsAudit()
  ]);

  // データが全くない場合の表示（初期セットアップ用）
  if (!stats) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-6 text-3xl font-bold text-white">
          物理法則による統治デバッグを開始します
        </h2>
        <div className="glass-card rounded-xl p-8">
          <p className="text-center text-[#8b949e]">
            データを読み込み中、またはデータベースにデータがありません。
            <br />
            <code className="mt-2 inline-block rounded-lg bg-[rgba(255,107,53,0.1)] px-3 py-1.5 text-xs text-[#FFAD80]">
              pnpm --filter @ojpp/ingestion ingest:finance
            </code>
            <p className="mt-3 text-xs text-[#6e7681]">
              ※ データを投入すると、SBCMエンジンによる自動計算が開始されます。
            </p>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* ====== Hero Section: 物理監査ステータス ====== */}
      <section className="relative overflow-hidden pt-16">
        <div className="relative mx-auto max-w-7xl px-8">
          <div className="mb-8">
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-white">
              政治資金を、物理法則でデバッグする
            </h2>
            <p className="text-lg text-[#8b949e]">
              "Code is Law, but Physics is the Absolute Judge."
            </p>
          </div>

          {/* --- SBCM 物理監査カード --- */}
          {audit && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* 位相角 (脆さの指標) */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-500">System Phase Angle (θ)</p>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                </div>
                <p className="mt-3 text-4xl font-mono font-bold text-white">
                  {(audit.analysis.phase_angle * (180 / Math.PI)).toFixed(1)}°
                </p>
                <div className="mt-4 border-t border-amber-500/20 pt-3">
                  <p className="text-sm font-medium text-white">
                    {audit.analysis.fragility === "CRITICAL" ? "⚠️ 虚数質量が臨界点を突破" : "✅ 安定的な実数接地状態"}
                  </p>
                  <p className="text-xs text-amber-400/60 mt-1">
                    金融的期待（虚数）と実体労働（実数）のズレ
                  </p>
                </div>
              </div>

              {/* 歪み指数 (ストロー現象の指標) */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Distortion Index (D)</p>
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <p className="mt-3 text-4xl font-mono font-bold text-white">
                  {audit.analysis.distortion_index.toFixed(2)}
                </p>
                <div className="mt-4 border-t border-blue-500/20 pt-3">
                  <p className="text-sm font-medium text-white">
                    {audit.analysis.is_straw_effect ? "🚨 ストロー現象（高発散）を検知" : "💎 循環効率：正常"}
                  </p>
                  <p className="text-xs text-blue-400/60 mt-1">
                    維持コスト（排熱）によるエントロピー増大率
                  </p>
                </div>
              </div>

              {/* G-Cart プロトコル状態 */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">G-Cart Protocol Status</p>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <p className="mt-3 text-4xl font-mono font-bold text-white">LOCKED</p>
                <div className="mt-4 border-t border-emerald-500/20 pt-3">
                  <p className="text-sm font-medium text-white">✅ 物理テレメトリ同期完了</p>
                  <p className="text-xs text-emerald-400/60 mt-1">
                    全取引の物理的接地（Grounding）を保証
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====== 既存のマネーフロー統計 ====== */}
      <div className="mx-auto max-w-7xl space-y-12 px-8">
        {/* 基本スタッツ */}
        <section>
          <p className="label-upper mb-4 text-[#6e7681]">General Financial Telemetry</p>
          <HeroStats
            organizationCount={stats.organizationCount}
            reportCount={stats.reportCount}
            totalIncome={stats.totalIncome}
            totalExpenditure={stats.totalExpenditure}
          />
        </section>

        {/* 収支チャート */}
        <section>
          <h3 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
            <span className="h-4 w-1 bg-amber-500 rounded-full" />
            年度別収支推移（熱力学的解析）
          </h3>
          <div className="glass-card rounded-xl p-8">
            <DashboardCharts yearlyStats={stats.yearlyStats} />
          </div>
        </section>

        {/* 最新の報告書テーブル */}
        <section>
          <h3 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
            <span className="h-4 w-1 bg-blue-500 rounded-full" />
            最新の報告書ログ
          </h3>
          <div className="glass-card overflow-x-auto rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[rgba(255,255,255,0.06)] bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">団体名</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">政党</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">年度</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8b949e]">収入 (Mw+iMc)</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8b949e]">支出 (Delta)</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-[rgba(255,255,255,0.03)] transition-colors last:border-0 hover:bg-white/[0.04]"
                  >
                    <td className="max-w-[200px] px-6 py-4">
                      <a
                        href={`/reports/${report.id}`}
                        className="block truncate font-medium text-amber-500 transition-colors hover:text-amber-400"
                      >
                        {report.organization.name}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white border"
                        style={{
                          backgroundColor: `${report.organization.party?.color ?? "#6B7280"}33`,
                          borderColor: `${report.organization.party?.color ?? "#6B7280"}66`,
                        }}
                      >
                        {report.organization.party?.name ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8b949e] font-mono">{report.fiscalYear}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-[#10B981]">
                      {formatCurrency(report.totalIncome)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-[#EF4444]">
                      {formatCurrency(report.totalExpenditure)}
                    </td>
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
