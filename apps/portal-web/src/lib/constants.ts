export interface ServiceDefinition {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  color: string;
  glowColor: string;
  port: number;
  url: string;
  prodUrl: string;
  gridSpan: 1 | 2;
  kpiLabels: string[];
}

/** ローカル開発時は localhost、本番では Vercel URL を返す */
export function getServiceUrl(service: ServiceDefinition): string {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return service.prodUrl;
  }
  return `http://localhost:${service.port}`;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: "moneyglass",
    name: "MONEYGLASS",
    nameJa: "政治資金の透明化",
    description: "全政党・全政治団体の資金の流れを可視化。AIエージェントが24時間監視・分析。",
    color: "#ff6b35",
    glowColor: "rgba(255, 107, 53, 0.15)",
    port: 3000,
    url: "/moneyglass",
    prodUrl: "/moneyglass",
    gridSpan: 2,
    kpiLabels: ["総収入", "総支出", "団体数", "報告書数"],
  },
  {
    id: "parliscope",
    name: "PARLISCOPE",
    nameJa: "議会の完全公開",
    description: "法案・投票・会期をすべての人とエージェントに開く。議会活動のリアルタイム追跡。",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.15)",
    port: 3003,
    url: "/parliscope",
    prodUrl: "https://parliscope.ojpp.dev",
    gridSpan: 2,
    kpiLabels: ["法案数", "議員数", "会期数", "投票数"],
  },
  {
    id: "policydiff",
    name: "POLICYDIFF",
    nameJa: "政策の差分比較",
    description: "全政党の政策をGit的手法で差分比較。変更履歴を透明に追跡。",
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.15)",
    port: 3002,
    url: "/policydiff",
    prodUrl: "https://policydiff.ojpp.dev",
    gridSpan: 1,
    kpiLabels: ["政策数", "カテゴリ数", "提案数"],
  },
  {
    id: "seatmap",
    name: "SEATMAP",
    nameJa: "議席勢力図",
    description: "国会の議席配分と選挙結果を可視化。衆参両院の勢力図をリアルタイム表示。",
    color: "#06d6d6",
    glowColor: "rgba(6, 214, 214, 0.15)",
    port: 3005,
    url: "/seatmap",
    prodUrl: "https://seatmap.ojpp.dev",
    gridSpan: 1,
    kpiLabels: ["衆院議席", "参院議席", "選挙数"],
  },
  {
    id: "culturescope",
    name: "CULTURESCOPE",
    nameJa: "文化政策の可視化",
    description: "文化庁予算・プログラム・政党スタンスを一元的に可視化。",
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.15)",
    port: 3006,
    url: "/culturescope",
    prodUrl: "https://culturescope.ojpp.dev",
    gridSpan: 1,
    kpiLabels: ["文化予算総額", "プログラム数", "政党スタンス数"],
  },
  {
    id: "socialguard",
    name: "SOCIALGUARD",
    nameJa: "社会保障ダッシュボード",
    description: "社会保障関係費・制度・都道府県別データを包括的に可視化。",
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.15)",
    port: 3007,
    url: "/socialguard",
    prodUrl: "https://socialguard.ojpp.dev",
    gridSpan: 1,
    kpiLabels: ["社会保障費総額", "制度数", "都道府県数"],
  },
  {
    id: "mesoscan",
    name: "MESO-SCAN",
    nameJa: "自治体別物理スキャン",
    description: "地域ごとのエントロピー排出量とストロー現象をデバッグ。",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.15)",
    port: 3008,
    url: "/meso-scan",
    prodUrl: "/meso-scan", 
    gridSpan: 1,
    kpiLabels: ["位相角", "歪み指数", "リーク率"],
  },
];

export const PLATFORM_META = {
  name: "Open Japan PoliTech Platform",
  shortName: "OJPP",
  version: "0.1.2",
  tagline: "AIエージェント時代の政治インフラ",
  subtitle: "6 Apps \u00d7 21 Models \u00d7 50+ API Endpoints",
  license: "AGPL-3.0-or-later",
  github: "https://github.com/ochyai/open-japan-politech-platform",
};
