"use client";

import { AnimatedCounter, FadeIn } from "@ojpp/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiKeySettings, apiHeaders, useApiKey } from "@/components/api-key-settings";
import { ArgumentGraphView } from "@/components/argument-graph/argument-graph-view";
import { Cluster3DView } from "@/components/cluster-3d-view";
import { EcosystemView } from "@/components/ecosystem/ecosystem-view";
import { OpinionStream } from "@/components/opinion-stream";
import { PheromoneHeatmap } from "@/components/pheromone/pheromone-heatmap";

type ViewMode = "stream" | "grid" | "ecosystem" | "argument" | "pheromone" | "cluster3d";

const PHASE_MAP: Record<string, { label: string; badge: string; dot: string }> = {
  OPEN: { label: "Collecting", badge: "badge-lumi badge-lumi--emerald", dot: "bg-emerald-400" },
  DELIBERATION: {
    label: "Deliberating",
    badge: "badge-lumi badge-lumi--amber",
    dot: "bg-amber-400",
  },
  CONVERGENCE: { label: "Converging", badge: "badge-lumi badge-lumi--cyan", dot: "bg-cyan-400" },
  CLOSED: { label: "Closed", badge: "badge-lumi badge-lumi--rose", dot: "bg-white/30" },
};

const STANCE_OPTIONS = [
  { value: "FOR", label: "賛成", ring: "stance-ring-for", text: "stance-for" },
  { value: "AGAINST", label: "反対", ring: "stance-ring-against", text: "stance-against" },
  { value: "NEUTRAL", label: "中立", ring: "stance-ring-neutral", text: "stance-neutral" },
];

const VIEW_TABS: { key: ViewMode; label: string; icon: string; desc: string }[] = [
  { key: "stream", label: "Stream", icon: "≋", desc: "意見が流れる" },
  { key: "grid", label: "Grid", icon: "⊞", desc: "一覧表示" },
  { key: "ecosystem", label: "Ecosystem", icon: "◉", desc: "生態系" },
  { key: "argument", label: "Arguments", icon: "⊛", desc: "議論構造" },
  { key: "pheromone", label: "Pheromone", icon: "◈", desc: "フェロモン" },
  { key: "cluster3d", label: "3D Clusters", icon: "◇", desc: "3Dクラスタ" },
];

interface OpinionNode {
  id: string;
  x: number;
  y: number;
  fitness: number;
  supportCount: number;
  clusterId: string;
  clusterColor: string;
  clusterLabel: string;
  content: string;
  pheromoneIntensity: number;
  pheromoneQuality: number;
  stance: string;
  embedding: number[] | null;
}

interface EcosystemData {
  topic: { id: string; phase: string; quorumThreshold: number };
  ecosystem: {
    opinions: OpinionNode[];
    clusters: {
      id: string;
      label: string;
      centerX: number;
      centerY: number;
      radius: number;
      color: string;
    }[];
  };
  argumentGraph: {
    nodes: {
      id: string;
      type: "CLAIM" | "PREMISE" | "EVIDENCE" | "REBUTTAL";
      content: string;
      confidence: number;
    }[];
    edges: {
      sourceId: string;
      targetId: string;
      relation: "ATTACK" | "SUPPORT" | "UNDERCUT";
      weight: number;
    }[];
  };
  pheromone: {
    sources: {
      id: string;
      x: number;
      y: number;
      intensity: number;
      quality: number;
      content?: string;
      stance?: string;
    }[];
  };
  history: {
    shannonIndex: number;
    avgFitness: number;
    avgPheromone: number;
    totalOpinions: number;
    createdAt: string;
  }[];
}

interface TopicDetail {
  id: string;
  title: string;
  description: string;
  phase: string;
  quorumThreshold: number;
  bill?: { id: string; title: string; summary: string } | null;
}

export default function TopicDetailPage() {
  const params = useParams();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [eco, setEco] = useState<EcosystemData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("stream");
  const [opinionText, setOpinionText] = useState("");
  const [stance, setStance] = useState("NEUTRAL");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState("");
  const [analyzePercent, setAnalyzePercent] = useState(0);
  const [aiRunning, setAiRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { apiKey, setApiKey } = useApiKey();

  const fetchData = useCallback(async () => {
    try {
      const [topicRes, ecoRes] = await Promise.all([
        fetch(`/api/topics/${topicId}`),
        fetch(`/api/topics/${topicId}/ecosystem`),
      ]);
      if (topicRes.ok) setTopic(await topicRes.json());
      if (ecoRes.ok) setEco(await ecoRes.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Track mouse for parallax effects
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        });
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  function dismissError() {
    setError(null);
  }

  async function validateApiKeyFor(actionName: string): Promise<boolean> {
    if (!apiKey) {
      setError(`APIキーが必要です。${actionName}の前に右上の「Set API Key」から設定してください。`);
      return false;
    }

    try {
      const res = await fetch("/api/health/apikey", {
        method: "GET",
        headers: apiHeaders(apiKey),
      });
      if (res.ok) return true;

      const data = await res.json().catch(() => ({}));
      setError(
        `${actionName}に失敗: ${data.error ?? `ステータス ${res.status}`}。右上の「Set API Key」から有効なAnthropicのAPIキーを設定してください。`,
      );
      return false;
    } catch (err) {
      setError(
        `${actionName}に失敗: ${err instanceof Error ? err.message : "APIキー検証に接続できません"}`,
      );
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opinionText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/topics/${topicId}/opinions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: opinionText.trim(), stance, authorId: "anonymous" }),
      });
      if (res.ok) {
        setOpinionText("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `投稿に失敗しました (${res.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ネットワークエラー");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAnalyze() {
    setError(null);
    const valid = await validateApiKeyFor("LLM分析");
    if (!valid) return;

    setAnalyzing(true);
    setAnalyzeProgress("分析開始...");
    setAnalyzePercent(0);

    let totalAnalyzed = 0;
    let totalToAnalyze = 0;
    let keepGoing = true;

    while (keepGoing) {
      try {
        const res = await fetch(`/api/topics/${topicId}/analyze`, {
          method: "POST",
          headers: apiHeaders(apiKey),
        });
        if (res.ok) {
          const data = await res.json();
          const batchSize = data.analyzedThisBatch ?? 0;
          const remaining = data.remainingUnanalyzed ?? 0;
          totalAnalyzed += batchSize;

          // On first batch, compute total
          if (totalToAnalyze === 0) {
            totalToAnalyze = totalAnalyzed + remaining;
          }

          const pct = totalToAnalyze > 0 ? Math.round((totalAnalyzed / totalToAnalyze) * 100) : 100;
          setAnalyzePercent(pct);

          if (remaining > 0) {
            setAnalyzeProgress(`${totalAnalyzed}/${totalToAnalyze}件 (${pct}%)`);
            await fetchData();
          } else {
            setAnalyzeProgress("完了");
            setAnalyzePercent(100);
            keepGoing = false;
            await fetchData();
          }
        } else {
          const data = await res.json().catch(() => ({}));
          setError(
            `LLM分析に失敗: ${data.error ?? `ステータス ${res.status}`}。右上の「Set API Key」からAnthropicのAPIキーを設定してください。`,
          );
          keepGoing = false;
        }
      } catch (err) {
        setError(`LLM分析エラー: ${err instanceof Error ? err.message : "APIに接続できません"}`);
        keepGoing = false;
      }
    }

    setTimeout(() => {
      setAnalyzeProgress("");
      setAnalyzePercent(0);
    }, 2000);
    setAnalyzing(false);
  }

  async function handleAi() {
    setError(null);
    const valid = await validateApiKeyFor("AI参加");
    if (!valid) return;

    setAiRunning(true);
    try {
      const res = await fetch(`/api/topics/${topicId}/ai-participate`, {
        method: "POST",
        headers: apiHeaders(apiKey),
        body: JSON.stringify({ perspectives: 3 }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          `AI参加に失敗: ${data.error ?? `ステータス ${res.status}`}。右上の「Set API Key」からAnthropicのAPIキーを設定してください。`,
        );
      }
    } catch (err) {
      setError(`AI参加エラー: ${err instanceof Error ? err.message : "APIに接続できません"}`);
    } finally {
      setAiRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            <div
              className="absolute inset-0 h-12 w-12 rounded-full border-2 border-emerald-400/10 border-b-emerald-400/50 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>
          <span className="text-sm text-white/20 tracking-widest uppercase">
            Loading ecosystem...
          </span>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Not Found</h1>
          <p className="text-white/30 mb-6">トピックが見つかりません。</p>
          <Link href="/topics" className="btn-glass">
            トピック一覧へ
          </Link>
        </div>
      </div>
    );
  }

  const phase = PHASE_MAP[topic.phase] ?? PHASE_MAP.OPEN;
  const isOpen = topic.phase !== "CLOSED";
  const opinions = eco?.ecosystem.opinions ?? [];
  const clusters = eco?.ecosystem.clusters ?? [];
  const nodes = eco?.argumentGraph.nodes ?? [];
  const edges = eco?.argumentGraph.edges ?? [];
  const pSources = eco?.pheromone.sources ?? [];

  const forOps = opinions.filter((o) => o.stance === "FOR");
  const againstOps = opinions.filter((o) => o.stance === "AGAINST");
  const neutralOps = opinions.filter((o) => o.stance === "NEUTRAL");

  return (
    <div ref={containerRef} className="min-h-screen pt-20 relative">
      {/* Background ambient orbs — mouse reactive */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)",
            left: `calc(20% + ${mousePos.x * 30}px)`,
            top: `calc(30% + ${mousePos.y * 30}px)`,
            transition: "left 0.8s ease, top 0.8s ease",
            animationName: "bubble-float",
            animationDuration: "12s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.025]"
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.4), transparent 70%)",
            right: `calc(10% + ${mousePos.x * -20}px)`,
            bottom: `calc(20% + ${mousePos.y * -20}px)`,
            transition: "right 0.8s ease, bottom 0.8s ease",
            animationName: "bubble-float",
            animationDuration: "15s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: "-5s",
          }}
        />
      </div>

      {/* ─── Error Banner ─── */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
          <div className="error-banner flex items-start gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 mt-0.5 text-rose-400/80"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
            <button
              type="button"
              onClick={dismissError}
              className="shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors text-rose-400/50 hover:text-rose-400"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 mb-6">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/topics"
              className="text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              Topics
            </Link>
            <span className="text-white/10">/</span>
            <span className={phase.badge}>
              <span className={`phase-dot ${phase.dot}`} />
              {phase.label}
            </span>
            <div className="ml-auto">
              <ApiKeySettings apiKey={apiKey} onApiKeyChange={setApiKey} />
            </div>
          </div>

          <h1
            className="text-4xl font-black tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {topic.title}
          </h1>
          <p className="mt-3 text-white/30 leading-relaxed max-w-2xl">{topic.description}</p>
        </FadeIn>

        {/* Stats row — floating bubbles */}
        <FadeIn delay={0.1}>
          <div className="mt-6 flex gap-6 sm:gap-8">
            {[
              { value: opinions.length, label: "Opinions", color: "cyan" },
              { value: forOps.length, label: "賛成", color: "emerald" },
              { value: againstOps.length, label: "反対", color: "rose" },
              { value: neutralOps.length, label: "中立", color: "slate" },
              { value: clusters.length, label: "Clusters", color: "violet" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="relative"
                style={{
                  animationName: "bubble-float",
                  animationDuration: `${4 + i * 0.7}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${i * -0.8}s`,
                }}
              >
                <div
                  className={`text-2xl font-black ${
                    s.color === "cyan"
                      ? "text-cyan-400/60"
                      : s.color === "emerald"
                        ? "text-emerald-400/60"
                        : s.color === "rose"
                          ? "text-rose-400/60"
                          : s.color === "violet"
                            ? "text-violet-400/60"
                            : "text-white/30"
                  }`}
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  <AnimatedCounter to={s.value} duration={1} />
                </div>
                <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ─── Controls Bar ─── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 mb-6">
        <FadeIn delay={0.15}>
          <div className="flex items-center gap-3 flex-wrap">
            {/* View mode tabs */}
            <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.04] p-1">
              {VIEW_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setViewMode(tab.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                    viewMode === tab.key
                      ? "bg-white/[0.08] text-white shadow-lg shadow-cyan-500/5"
                      : "text-white/30 hover:text-white/60"
                  }`}
                  title={tab.desc}
                >
                  <span className="text-sm opacity-60">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-white/[0.06] mx-1" />

            {/* Action buttons with descriptions */}
            <div className="relative">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing || opinions.length === 0 || !apiKey}
                className="action-tooltip btn-glass text-xs py-2 px-4"
                data-tip={
                  !apiKey
                    ? "APIキーが必要です。右上の「Set API Key」から設定してください。"
                    : "議論構造を自動抽出し、クラスタリングを実行"
                }
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-cyan-400/30 border-t-cyan-400 animate-spin" />
                    {analyzeProgress || "分析中..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-cyan-400/60"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    LLM分析
                  </span>
                )}
              </button>
              {/* Progress bar */}
              {analyzing && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700 ease-out"
                    style={{ width: `${analyzePercent}%` }}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAi}
              disabled={aiRunning || !apiKey}
              className="action-tooltip btn-glass text-xs py-2 px-4"
              data-tip={
                !apiKey
                  ? "APIキーが必要です。右上の「Set API Key」から設定してください。"
                  : "AIが3つの異なる視点から意見を自動生成"
              }
            >
              {aiRunning ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-emerald-400/30 border-t-emerald-400 animate-spin" />
                  AI生成中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-emerald-400/60"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  AI参加
                </span>
              )}
            </button>
          </div>
        </FadeIn>
      </div>

      {/* ─── Analyze Progress Bar (large) ─── */}
      {analyzing && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 mb-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="h-4 w-4 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
              <span className="text-sm text-white/60 font-medium">LLM分析実行中</span>
              <span className="text-sm text-cyan-400/80 font-bold ml-auto">{analyzePercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 transition-all duration-700 ease-out"
                style={{
                  width: `${analyzePercent}%`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
              />
            </div>
            <p className="mt-2 text-[10px] text-white/25">
              {analyzeProgress} — 議論構造抽出 → 埋め込み生成 → クラスタリング → ラベル生成 →
              適応度計算
            </p>
          </div>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 mb-8">
        {/* Stream View — kinetic typography */}
        {viewMode === "stream" && (
          <FadeIn>
            <div
              className="glass-card overflow-hidden scan-lines liquid-lens-container noise-flicker"
              style={{ height: 520 }}
            >
              {opinions.length > 0 ? (
                <OpinionStream
                  opinions={opinions.map((o) => ({
                    content: o.content,
                    stance: o.stance,
                    fitness: o.fitness,
                  }))}
                  lanes={10}
                  className="h-full"
                  density="normal"
                />
              ) : (
                <EmptyState onAi={handleAi} aiRunning={aiRunning} hasApiKey={Boolean(apiKey)} />
              )}
            </div>
          </FadeIn>
        )}

        {/* Grid View — opinion mosaic with text and colors */}
        {viewMode === "grid" && (
          <FadeIn>
            {opinions.length > 0 ? (
              <div>
                {/* Stance distribution bar */}
                <div className="flex gap-1 mb-4 h-2 rounded-full overflow-hidden">
                  {forOps.length > 0 && (
                    <div
                      className="bg-emerald-400/60 rounded-full"
                      style={{ flex: forOps.length }}
                    />
                  )}
                  {neutralOps.length > 0 && (
                    <div className="bg-white/20 rounded-full" style={{ flex: neutralOps.length }} />
                  )}
                  {againstOps.length > 0 && (
                    <div
                      className="bg-rose-400/60 rounded-full"
                      style={{ flex: againstOps.length }}
                    />
                  )}
                </div>
                <div className="flex gap-4 mb-4 text-[10px] text-white/30">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
                    賛成 {forOps.length}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    中立 {neutralOps.length}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400/60" />
                    反対 {againstOps.length}
                  </span>
                  {clusters.length > 0 && (
                    <span className="ml-auto">{clusters.length} clusters</span>
                  )}
                </div>

                {/* Opinion Mosaic Grid */}
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {[...opinions]
                    .sort((a, b) => b.fitness - a.fitness)
                    .map((op) => {
                      const stanceColor =
                        op.stance === "FOR"
                          ? "emerald"
                          : op.stance === "AGAINST"
                            ? "rose"
                            : "slate";
                      const borderColor =
                        stanceColor === "emerald"
                          ? "border-emerald-400/20"
                          : stanceColor === "rose"
                            ? "border-rose-400/20"
                            : "border-white/[0.06]";
                      const glowColor =
                        stanceColor === "emerald"
                          ? "rgba(52,211,153,0.06)"
                          : stanceColor === "rose"
                            ? "rgba(251,113,133,0.06)"
                            : "rgba(255,255,255,0.02)";
                      const dotColor =
                        stanceColor === "emerald"
                          ? "bg-emerald-400"
                          : stanceColor === "rose"
                            ? "bg-rose-400"
                            : "bg-white/40";
                      const clusterBg = op.clusterColor ? `${op.clusterColor}08` : "transparent";

                      return (
                        <div
                          key={op.id}
                          className={`relative rounded-xl border ${borderColor} p-3 transition-all duration-300 hover:scale-[1.02] hover:border-white/15 cursor-default group`}
                          style={{
                            background: `linear-gradient(135deg, ${glowColor}, ${clusterBg})`,
                          }}
                        >
                          {/* Stance dot */}
                          <div
                            className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${dotColor}`}
                          />

                          {/* Opinion text */}
                          <p className="text-[11px] text-white/50 leading-relaxed line-clamp-4 group-hover:text-white/70 transition-colors">
                            {op.content}
                          </p>

                          {/* Meta */}
                          <div className="mt-2 flex items-center gap-2 text-[9px] text-white/15">
                            <span className="font-mono">f={op.fitness.toFixed(2)}</span>
                            {op.clusterLabel && (
                              <span
                                className="truncate max-w-[80px] px-1 py-0.5 rounded text-[8px]"
                                style={{
                                  background: op.clusterColor ? `${op.clusterColor}15` : undefined,
                                  color: op.clusterColor ? `${op.clusterColor}80` : undefined,
                                }}
                              >
                                {op.clusterLabel}
                              </span>
                            )}
                            {op.supportCount > 0 && (
                              <span className="ml-auto">♥{op.supportCount}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="glass-card overflow-hidden" style={{ minHeight: 400 }}>
                <EmptyState onAi={handleAi} aiRunning={aiRunning} hasApiKey={Boolean(apiKey)} />
              </div>
            )}
          </FadeIn>
        )}

        {/* Ecosystem View — Canvas */}
        {viewMode === "ecosystem" && (
          <FadeIn>
            <div className="glass-card overflow-hidden" style={{ minHeight: 500 }}>
              {opinions.length > 0 ? (
                <EcosystemView
                  opinions={opinions}
                  clusters={clusters}
                  className="h-[560px] w-full"
                />
              ) : (
                <EmptyState onAi={handleAi} aiRunning={aiRunning} hasApiKey={Boolean(apiKey)} />
              )}
            </div>
          </FadeIn>
        )}

        {/* Argument Graph View */}
        {viewMode === "argument" && (
          <FadeIn>
            <div className="glass-card overflow-hidden" style={{ minHeight: 500 }}>
              {nodes.length > 0 ? (
                <ArgumentGraphView nodes={nodes} edges={edges} className="h-[560px] w-full" />
              ) : (
                <div className="flex h-[500px] flex-col items-center justify-center text-center px-8">
                  <div
                    className="w-24 h-24 rounded-full mb-8 flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)",
                      animationName: "bubble-float",
                      animationDuration: "6s",
                      animationTimingFunction: "ease-in-out",
                      animationIterationCount: "infinite",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-cyan-400/40"
                    >
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="18" cy="18" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <path d="M8.5 7.5L15.5 16.5M8.5 6h7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">議論構造が未抽出</h3>
                  <p className="text-sm text-white/25 max-w-md mb-6">
                    「LLM分析」を実行すると、意見からClaim・Premise・Evidence・Rebuttalが自動抽出され、
                    Attack/Support関係がグラフ化されます。
                  </p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing || opinions.length === 0 || !apiKey}
                    className="btn-glow text-xs py-2.5 px-5"
                  >
                    {analyzing ? "分析中..." : "LLM分析を実行"}
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* Pheromone Heatmap */}
        {viewMode === "pheromone" && (
          <FadeIn>
            <div className="glass-card overflow-hidden" style={{ minHeight: 500 }}>
              {pSources.length > 0 ? (
                <PheromoneHeatmap sources={pSources} className="h-[560px] w-full" />
              ) : (
                <EmptyState onAi={handleAi} aiRunning={aiRunning} hasApiKey={Boolean(apiKey)} />
              )}
            </div>
          </FadeIn>
        )}

        {/* 3D Cluster View */}
        {viewMode === "cluster3d" && (
          <FadeIn>
            <div className="glass-card overflow-hidden" style={{ minHeight: 500 }}>
              {opinions.length > 0 ? (
                <Cluster3DView
                  opinions={opinions.map((o) => ({
                    id: o.id,
                    content: o.content,
                    stance: o.stance,
                    clusterId: o.clusterId,
                    clusterLabel: o.clusterLabel,
                    clusterColor: o.clusterColor,
                    fitness: o.fitness,
                    embedding: o.embedding,
                  }))}
                  className="h-[560px] w-full"
                />
              ) : (
                <EmptyState onAi={handleAi} aiRunning={aiRunning} hasApiKey={Boolean(apiKey)} />
              )}
            </div>
            {clusters.length === 0 && opinions.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-xs text-white/25 mb-3">
                  クラスタリングにはLLM分析が必要です。APIキーを設定して分析を実行してください。
                </p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing || !apiKey}
                  className="btn-glow text-xs py-2 px-5"
                >
                  {analyzing ? "分析中..." : "LLM分析を実行"}
                </button>
              </div>
            )}
          </FadeIn>
        )}
      </div>

      {/* ─── Opinion Submission ─── */}
      {isOpen && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
          <FadeIn delay={0.2}>
            <div
              className={`glass-card p-6 transition-all duration-500 ${submitted ? "submit-flash" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">
                  Post your opinion
                </h3>
                {submitted && (
                  <span className="text-xs text-emerald-400 font-semibold animate-in">
                    投稿しました — ストリームに合流中
                  </span>
                )}
              </div>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={opinionText}
                  onChange={(e) => setOpinionText(e.target.value)}
                  rows={3}
                  placeholder="この議論について、あなたの考えを..."
                  className="input-abyss mb-4"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {STANCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStance(opt.value)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          stance === opt.value
                            ? `${opt.ring} ${opt.text}`
                            : "border-white/[0.06] text-white/25 hover:border-white/10 hover:text-white/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !opinionText.trim()}
                    className="btn-glow text-sm py-2.5 px-6"
                  >
                    {submitting ? "投稿中..." : "投稿する"}
                  </button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}

/* ── Stance Column for Grid View ── */
function _StanceColumn({
  title,
  color,
  opinions,
}: {
  title: string;
  color: "emerald" | "rose" | "slate";
  opinions: OpinionNode[];
}) {
  const colorMap = {
    emerald: { dot: "bg-emerald-400/60", text: "text-emerald-400/60", card: "opinion-card-for" },
    rose: { dot: "bg-rose-400/60", text: "text-rose-400/60", card: "opinion-card-against" },
    slate: { dot: "bg-white/30", text: "text-white/30", card: "opinion-card-neutral" },
  };
  const c = colorMap[color];

  const sorted = [...opinions].sort((a, b) => b.fitness - a.fitness);

  return (
    <div>
      <div className={`flex items-center gap-2 mb-3 ${c.text}`}>
        <span className={`h-2 w-2 rounded-full ${c.dot}`} />
        <span className="text-sm font-bold">{title}</span>
        <span className="text-[10px] text-white/20 ml-auto">{opinions.length}</span>
      </div>
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {sorted.map((op, i) => (
          <div
            key={op.id}
            className={`opinion-card ${c.card}`}
            style={{
              animationName: "bubble-float",
              animationDuration: `${5 + (i % 4) * 1.5}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${i * -0.7}s`,
            }}
          >
            <p className="text-sm text-white/60 leading-relaxed">{op.content}</p>
            <div className="mt-2 flex gap-3 text-[10px] text-white/15">
              <span>fitness {op.fitness.toFixed(2)}</span>
              {op.clusterLabel && <span>cluster: {op.clusterLabel}</span>}
            </div>
          </div>
        ))}
        {opinions.length === 0 && (
          <div className="text-center py-8 text-xs text-white/15">まだ意見がありません</div>
        )}
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({
  onAi,
  aiRunning,
  hasApiKey,
}: {
  onAi: () => void;
  aiRunning: boolean;
  hasApiKey: boolean;
}) {
  return (
    <div className="flex h-[480px] flex-col items-center justify-center text-center px-8 relative">
      {/* Floating background bubbles */}
      <div
        className="absolute w-40 h-40 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.5), transparent 70%)",
          animationName: "bubble-float",
          animationDuration: "8s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          top: "15%",
          left: "20%",
        }}
      />
      <div
        className="absolute w-28 h-28 rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, rgba(52,211,153,0.5), transparent 70%)",
          animationName: "bubble-float",
          animationDuration: "10s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDelay: "-3s",
          bottom: "20%",
          right: "15%",
        }}
      />

      <div
        className="relative h-20 w-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6"
        style={{
          animationName: "bubble-float",
          animationDuration: "5s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/15"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">まだ意見がありません</h3>
      <p className="text-sm text-white/25 max-w-md mb-8">
        意見を投稿するか、AIに多角的な視点から意見を生成させましょう。
        投稿された意見はストリームに合流し、リアルタイムに可視化されます。
      </p>
      <button
        type="button"
        onClick={onAi}
        disabled={aiRunning || !hasApiKey}
        className="btn-glow text-xs py-2.5 px-5"
      >
        {aiRunning ? "AI生成中..." : "AIに意見を生成させる（3つの視点）"}
      </button>
    </div>
  );
}
