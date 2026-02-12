# Open Japan PoliTech Platform v0.1

[![CI](https://github.com/ochyai/open-japan-politech-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/ochyai/open-japan-politech-platform/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1-orange.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-F69220?logo=pnpm)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> **AIエージェント時代の政治インフラ — 政党にも企業にもよらない、完全オープンな政治テクノロジー基盤**

> [!CAUTION]
> **v0.1 はデモ版です。** 現在のデータにはサンプル・架空データが含まれています。詳細は[データの性質と注意事項](#データの性質と注意事項)を参照してください。

---

## 1行で起動

> **必要なもの**: [Docker](https://docs.docker.com/get-docker/) と [Git](https://git-scm.com/) だけ。Node.js / pnpm は自動インストールされます。

```bash
git clone https://github.com/ochyai/open-japan-politech-platform.git && cd open-japan-politech-platform && bash setup.sh
```

セットアップが完了すると、3つのURLが表示されます:

| アプリ | URL | 概要 |
|---|---|---|
| **MoneyGlass** | http://localhost:3000 | 政治資金可視化 |
| **PolicyDiff** | http://localhost:3002 | 政策比較 |
| **ParliScope** | http://localhost:3003 | 議会監視 |

> 停止: `Ctrl+C` / 再起動: `bash setup.sh` / DB削除: `docker compose down -v`

---

## なぜ今、PoliTechなのか

政治は長く、政党と企業の専有物だった。政治資金の流れを追うには専門知識が必要だった。全政党の政策を比較するには膨大な時間がかかった。国会の法案を読み解くには法律の素養が求められた。

**AIエージェントの時代が、この構造を変える。**

あなたのAIエージェントが、24時間365日、全政党の政治資金を監視する。全政党の政策変更を追跡し、差分を届ける。全法案を読み、あなたに影響のある部分を要約する。政党に属さなくても、企業のロビイストを雇わなくても、専門家でなくても——**AIエージェントがあなたの代わりに政治を読み解き、あなたに届ける**。

これがPoliTechだ。GovTech（行政DX）でもCivicTech（市民技術）でもない。**政治の意思決定プロセスそのものを、AIエージェントと共に、すべての人に開くテクノロジー**。

## PoliTech = 第三の概念

| | GovTech（行政DX） | CivicTech（市民技術） | **PoliTech（政治技術）** |
|---|---|---|---|
| **問い** | 決まった政策をいかに届けるか | 市民がいかに参加するか | **AIエージェント時代に、誰もが政治プロセスを実行・享受するには** |
| **主体** | 政府 | 市民社会 | **市民 + AIエージェント** |
| **時代** | 電子政府時代 | Web 2.0時代 | **AIエージェント時代** |
| **例** | マイナンバー、X-Road | Code for Japan、FixMyStreet | **本プラットフォーム、vTaiwan、Decidim** |

## 7つの原則

1. **エージェントファースト** — AIエージェントの参加を前提に設計。人間が見ていなくてもエージェントが動く
2. **非党派性** — 特定の政党・政治団体に依存しない。全政党を等しく扱う
3. **非企業性** — 企業が運営しない。企業の代弁者にもならない。完全にコミュニティ主導
4. **完全オープン** — コード、データ、意思決定プロセスの全てがオープン。AGPL-3.0
5. **誰でも参加** — 技術者でなくても、どの政治的立場からでも、人間でもAIでも参加できる
6. **議席不要** — 政治のデジタル化のために議席を取る必要はない。インフラは市民とエージェントが作る
7. **持続性** — 政権交代・組織変更に左右されない。フォーク可能で分散的

---

## プロダクト

### MoneyGlass — 政治資金を、ガラスのように透明に

全政党・全政治団体の資金の流れを可視化。収支報告書を構造化し、収入9カテゴリ・支出8カテゴリで分類。Rechartsによるインタラクティブなグラフ（グラデーション付き棒グラフ・ドーナツチャート）、AnimatedCounterによるダッシュボード統計、GradientCardによる政党別カードで、誰もが政治資金の実態にアクセスできる。

| ダッシュボード | 政党別資金集計 |
|---|---|
| ![MoneyGlass Dashboard](docs/screenshots/moneyglass-dashboard.png) | ![MoneyGlass Parties](docs/screenshots/moneyglass-parties.png) |

| アプリ | ポート | 用途 |
|---|---|---|
| `moneyglass-web` | 3000 | ダッシュボード、団体検索、報告書閲覧 |
| `moneyglass-admin` | 3001 | データ管理・メンテナンス |

### PolicyDiff — 全政党の政策を、差分で比較する

全15政党のマニフェスト・政策を10カテゴリに分類し、政党間の比較を可能にする。Markdown形式の政策テキストをremark + remark-htmlでレンダリング。カテゴリ別・政党別のフィルタリング、政党カラーチップによる直感的なUI、スナップスクロール対応の比較カード、市民からの政策提案機能を実装。

| ホーム | 政党比較 |
|---|---|
| ![PolicyDiff Home](docs/screenshots/policydiff-home.png) | ![PolicyDiff Compare](docs/screenshots/policydiff-compare.png) |

| アプリ | ポート | 用途 |
|---|---|---|
| `policydiff-web` | 3002 | 政策比較、カテゴリ別閲覧、提案投稿 |

### ParliScope — 議会を、すべての人とエージェントに開く

国会の会期・法案・議員・投票・討論データをAPI化。14会期分のデータを構造化し、BillTimeline（法案ステータスのステップインジケーター）、VoteChart（投票結果のアニメーション棒グラフ）、議員カードのページネーション付き一覧で、法案追跡と議員分析が可能。

| ダッシュボード | 議員名簿 |
|---|---|
| ![ParliScope Home](docs/screenshots/parliscope-home.png) | ![ParliScope Politicians](docs/screenshots/parliscope-politicians.png) |

| アプリ | ポート | 用途 |
|---|---|---|
| `parliscope-web` | 3003 | 法案検索、議員情報、投票記録 |
| `parliscope-admin` | 3004 | データ管理・メンテナンス |

---

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│                        クライアント                              │
│     ブラウザ / AIエージェント / MCP クライアント                    │
└───────┬───────────────┬───────────────┬─────────────────────────┘
        │               │               │
        ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  MoneyGlass   │ │  PolicyDiff   │ │  ParliScope   │
│  :3000/:3001  │ │    :3002      │ │  :3003/:3004  │
│  Next.js 15   │ │  Next.js 15   │ │  Next.js 15   │
│  App Router   │ │  App Router   │ │  App Router   │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │               │               │
        ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      共有パッケージ                               │
│  @ojpp/api  │  @ojpp/ui  │  @ojpp/db  │  @ojpp/ingestion       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PostgreSQL (Prisma 6)                       │
│  21モデル │ 10 enum │ 47都道府県 │ 15政党 │ 政治資金・法案・政策  │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────────┐
│                     データソース (ingestion)                     │
│  政治資金DB (OCR済)  │  国会会議録API  │  マニフェスト (手動)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## クイックスタート

### 自動セットアップ（推奨）

[上部の「1行で起動」](#1行で起動)を参照してください。`bash setup.sh` で Docker + Node.js + DB + 全アプリが自動で起動します。

### 手動セットアップ

<details>
<summary>手動で個別にセットアップしたい場合</summary>

**前提条件**: Node.js 22+ / pnpm 10+ / PostgreSQL（Docker or Supabase）

```bash
# クローン
git clone https://github.com/ochyai/open-japan-politech-platform.git
cd open-japan-politech-platform

# PostgreSQL を Docker で起動
docker compose up -d

# 環境変数（デフォルトで Docker の DB に接続します）
cp .env.example .env

# 依存関係インストール + DB準備
pnpm install
pnpm db:generate
pnpm --filter @ojpp/db push
pnpm db:seed

# データ取り込み（全データソース一括）
pnpm ingest:all

# 開発サーバー起動（全アプリ）
pnpm dev
```

</details>

個別起動も可能:

```bash
pnpm dev:moneyglass    # MoneyGlass (port 3000 + 3001)
pnpm dev:policydiff    # PolicyDiff (port 3002)
pnpm dev:parliscope    # ParliScope (port 3003 + 3004)
```

### 品質管理コマンド

| コマンド | 説明 |
|---|---|
| `pnpm test` | Vitest テスト実行（33テスト） |
| `pnpm lint` | Biome lint チェック |
| `pnpm lint:fix` | Biome lint 自動修正 |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm build` | プロダクションビルド（全5アプリ） |
| `pnpm format` | Biome フォーマット |

### データベース操作

| コマンド | 説明 |
|---|---|
| `pnpm db:studio` | Prisma Studio（DB GUI） |
| `pnpm db:reset` | DB リセット + 再シード |
| `pnpm db:generate` | Prisma Client 再生成 |
| `pnpm --filter @ojpp/db push` | スキーマをDBに直接反映（開発用） |
| `pnpm db:migrate` | マイグレーション実行 |

---

## API仕様

全APIはRESTful JSONを返し、ページネーション（`?page=1&limit=20`）に対応。

### MoneyGlass API (port 3000)

| メソッド | エンドポイント | 説明 | パラメータ |
|---|---|---|---|
| GET | `/api/organizations` | 政治団体一覧 | `party`, `type`, `page`, `limit` |
| GET | `/api/organizations/:id` | 団体詳細 | — |
| GET | `/api/reports` | 報告書一覧 | `year`, `org`, `page`, `limit` |
| GET | `/api/reports/:id` | 報告書詳細（収支明細含む） | — |
| GET | `/api/parties` | 政党一覧（資金集計付き） | — |
| GET | `/api/stats` | ダッシュボード統計 | — |

<details>
<summary>APIレスポンス例</summary>

```bash
curl http://localhost:3000/api/organizations?limit=2
```

```json
{
  "data": [
    {
      "id": "...",
      "name": "自由民主党東京都支部連合会",
      "type": "PARTY_BRANCH",
      "partyId": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 150,
    "totalPages": 75
  }
}
```

</details>

### PolicyDiff API (port 3002)

| メソッド | エンドポイント | 説明 | パラメータ |
|---|---|---|---|
| GET | `/api/policies` | 政策一覧 | `party`, `category`, `page`, `limit` |
| GET | `/api/policies/:id` | 政策詳細 | — |
| GET | `/api/parties` | 政党一覧（カテゴリ別件数付き） | — |
| GET | `/api/compare` | 政策比較 | `category`, `parties` |
| GET | `/api/proposals` | 提案一覧 | `page`, `limit` |
| GET | `/api/categories` | カテゴリ一覧（件数付き） | — |

### ParliScope API (port 3003)

| メソッド | エンドポイント | 説明 | パラメータ |
|---|---|---|---|
| GET | `/api/sessions` | 会期一覧 | — |
| GET | `/api/sessions/:id` | 会期詳細 + 法案 | — |
| GET | `/api/bills` | 法案一覧 | `status`, `session`, `page`, `limit` |
| GET | `/api/bills/:id` | 法案詳細（投票・議論含む） | — |
| GET | `/api/politicians` | 議員一覧 | `party`, `chamber`, `page`, `limit` |
| GET | `/api/politicians/:id` | 議員詳細 + 投票履歴 | — |
| GET | `/api/stats` | ダッシュボード統計 | — |

---

## データソース

| データ | ソース | ライセンス | 取り込み方法 |
|---|---|---|---|
| 政治資金 | [political-finance-database.com](https://political-finance-database.com) (OCR済み収支報告書) | パブリック | `pnpm ingest:finance` |
| 国会会議録 | [国会会議録API](https://kokkai.ndl.go.jp/) (kokkai.ndl.go.jp) | CC BY 4.0 | `pnpm ingest:parliament` |
| 法案データ | [SmartNews SMRI](https://github.com/smartnews-smri) (GitHub) | MIT | `pnpm ingest:parliament` |
| マニフェスト | 各政党公式サイト、早稲田大学 #くらべてえらぶ | 手動キュレーション | `pnpm ingest:manifesto` |

---

## データの性質と注意事項

> [!WARNING]
> v0.1 のデータにはサンプル・架空データが含まれています。プロダクション利用前に実データソースへの接続が必要です。

| データ種別 | 性質 | 詳細 |
|---|---|---|
| **政党マスタ** | 実データ | 実在する15政党（名称・カラー・設立日・公式サイト） |
| **都道府県** | 実データ | 47都道府県コード |
| **国会会期** | 実データ | 第200〜213回（2019〜2024年）の実際の日程 |
| **議員名** | 実データ | 実在する国会議員40名（氏名・所属・選挙区） |
| **法案** | 実在+架空混在 | 31件中、大半は実在法案（所得税法改正、GX推進法等）だが一部に架空法案を含む |
| **政治資金** | **架空データ** | 疑似乱数（seededRandom）で生成。金額規模は現実を参考にしているが、収支明細は全て架空 |
| **政治団体** | **架空データ** | 「{党名}本部」「{党短名}政策研究会」のテンプレート生成。実在の個別団体名ではない |
| **政策マニフェスト** | **デモデータ** | 各党の公式マニフェストを参考に作成したデモ用テキスト。公式の政策文書ではない |
| **投票記録** | **架空データ** | 議員と法案の関連付けはサンプルデータ |

**データセット**: 生成に使用したソースデータは [`data/`](data/) ディレクトリに格納しています。

---

## データモデル

Prismaスキーマに21モデル・10 enumを定義。

```
政治主体                    政治資金                      議会
┌──────────┐              ┌──────────────┐             ┌──────────────┐
│  Party   │◄────────────►│  FundReport  │             │ DietSession  │
│ (15政党)  │              │  (収支報告書)  │             │  (国会会期)   │
└────┬─────┘              └──┬───────┬───┘             └──────┬───────┘
     │                       │       │                        │
     ▼                       ▼       ▼                        ▼
┌──────────┐         ┌────────┐ ┌─────────┐           ┌──────────┐
│Politician│         │Income  │ │Expense  │           │   Bill   │
│  (議員)   │         │(収入)  │ │(支出)   │           │  (法案)   │
└──────────┘         └────────┘ └─────────┘           └──┬───┬──┘
     │                                                    │   │
     ▼                                                    ▼   ▼
┌──────────┐         ┌──────────────┐              ┌─────┐ ┌──────────┐
│Prefecture│         │   Policy     │              │Vote │ │Discussion│
│(都道府県) │         │ (10カテゴリ)  │              │(投票)│ │ (討論)   │
└──────────┘         └──────────────┘              └─────┘ └──────────┘
```

---

## エージェントファースト設計

AIエージェント時代に、政党や企業が独占してきた政治プロセスを誰もが実行できるようにする。

| 設計原則 | 詳細 |
|---|---|
| **API-First** | 全データをRESTful APIで提供。エージェントが直接アクセス |
| **機械可読データ** | JSON構造化データを標準。人間用UIとエージェント用APIの両方 |
| **エージェント認証** *(v0.2予定)* | AIエージェント用の認証・権限管理。エージェントは一級市民 |
| **MCP対応** *(v0.2予定)* | Model Context Protocol による外部AIとのシームレスな連携 |
| **監査ログ** *(v0.2予定)* | 全操作のトレーサビリティを保証。エージェントの行動も完全に透明 |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript 5.9 |
| Database | PostgreSQL (via Supabase / local) |
| ORM | Prisma 6 |
| Styling | Tailwind CSS v4 |
| Design System | @ojpp/ui — カスタムテーマ、アニメーション、11コンポーネント |
| Charts | Recharts (全3アプリ) |
| Markdown | remark + remark-html (PolicyDiff) |
| Package Manager | pnpm 10 (monorepo with workspaces) |
| Linter/Formatter | Biome 2.3 |
| Testing | Vitest 3 (33 tests) |
| CI/CD | GitHub Actions (lint → typecheck → test → build) |

## ディレクトリ構造

```
open-japan-politech-platform/
├── apps/
│   ├── moneyglass-web/       # MoneyGlass 公開フロントエンド (:3000)
│   │   └── src/app/
│   │       ├── api/          #   6 APIルート
│   │       ├── organizations/ #   団体一覧・詳細
│   │       ├── parties/      #   政党別資金
│   │       └── reports/      #   報告書詳細
│   ├── moneyglass-admin/     # MoneyGlass 管理画面 (:3001)
│   ├── policydiff-web/       # PolicyDiff フロントエンド (:3002)
│   │   └── src/app/
│   │       ├── api/          #   6 APIルート
│   │       ├── category/     #   カテゴリ別政策
│   │       ├── compare/      #   政党比較
│   │       └── party/        #   政党別政策
│   ├── parliscope-web/       # ParliScope 公開フロントエンド (:3003)
│   │   └── src/app/
│   │       ├── api/          #   7 APIルート
│   │       ├── bills/        #   法案一覧・詳細
│   │       ├── politicians/  #   議員一覧・詳細
│   │       └── sessions/     #   会期一覧・詳細
│   └── parliscope-admin/     # ParliScope 管理画面 (:3004)
├── packages/
│   ├── ui/                   # @ojpp/ui — 11コンポーネント + デザインシステム (theme.css)
│   ├── db/                   # @ojpp/db — Prisma スキーマ (21モデル / 10 enum)
│   ├── api/                  # @ojpp/api — ページネーション, エラー, CORS, BigInt変換
│   └── ingestion/            # @ojpp/ingestion — 政治資金・議会・マニフェスト取り込み
├── data/                     # デモ用データセット（JSON）— 詳細は data/README.md
├── paper/                    # 学術論文（PoliTech 5地域比較分析）
├── docs/                     # ドキュメント・スクリーンショット・リサーチノート
├── supabase/                 # Supabase ローカル開発設定
├── .github/workflows/        # CI/CD (lint → typecheck → test → build)
├── CONTRIBUTING.md           # コントリビューションガイド
├── CODE_OF_CONDUCT.md        # 行動規範
├── SECURITY.md               # セキュリティポリシー
└── LICENSE                   # AGPL-3.0
```

---

## 既存プロジェクトとの関係

| プロジェクト | 関係 |
|---|---|
| チームみらい（まる見え政治資金等） | 技術的参考。ただし政党紐づきのため、本プラットフォームは全15政党対応の非党派的・汎用版。デザイン品質でも同等以上を目指す |
| DD2030（Polimoney等） | 方向性は近い。本プラットフォームはエージェントファースト設計を追加 |
| g0v / vTaiwan | 台湾モデルの日本版。市民社会主導の非党派アプローチを踏襲 |
| Decidim / Consul | 欧州の参加型民主主義基盤。モジュラー設計を参考 |
| mySociety | 英国のNGOモデル。20年+の持続性を参考 |

---

## ロードマップ

- [x] Prismaスキーマ定義（21モデル・10 enum）
- [x] シードデータ（47都道府県・15政党 — チームみらい、NHK党、教育無償化を実現する会、沖縄社会大衆党を追加）
- [x] 3プロダクトのMVP実装（API + フロントエンド）
- [x] データ取り込みパイプライン（政治資金・議会・マニフェスト）
- [x] CI/CD パイプライン
- [x] ユニットテスト（33テスト）
- [x] デザインシステム構築（@ojpp/ui — theme.css、11コンポーネント、アニメーション）
- [x] 3アプリのグラフィカルデザイン刷新（HeroSection、GradientCard、NavigationBar）
- [x] インタラクティブチャート拡充（Recharts全3アプリ対応、AnimatedCounter）
- [x] 法案タイムライン・投票チャート・ページネーション
- [x] 学術論文（PoliTech 5地域比較分析）
- [ ] 認証・認可（Supabase Auth）
- [ ] AIエージェント認証（APIキー・MCP）
- [ ] GraphQL API
- [ ] リアルタイム通知（政策変更・法案ステータス）
- [ ] 多言語対応（英語）
- [x] デプロイ（Vercel）

---

## 論文

本プラットフォームの理論的基盤となる論文を [`paper/`](paper/) ディレクトリに収録しています。

> **PoliTech：政党にも企業にもよらない政治のデジタル化——オープンソース・エージェントレディな政治テクノロジー基盤の国際比較分析**
>
> *PoliTech: Non-Partisan, Non-Corporate Digitalization of Politics — A Comparative Analysis of Open-Source, Agent-Ready Political Technology Infrastructure*

GovTech（行政DX）とCivicTech（市民技術）の二分法では捉えきれない第三の領域——「PoliTech（政治技術）」を定義し、台湾（g0v/vTaiwan）、英国（mySociety）、米国（Code for America / FEC）、欧州（Decidim / CONSUL Democracy）、日本（チームみらい / Open Japan PoliTech Platform）の5地域を6軸比較フレームワーク（非党派性・非企業性・オープンソース度・制度的接合性・参加の包摂性・エージェントレディ度）で分析しています。

- [paper.pdf](paper/paper.pdf) — PDF版
- [paper.md](paper/paper.md) — Markdown版

---

## ライセンス

[AGPL-3.0](LICENSE) — 改変版も含めてオープンソースであり続けることを保証する。ネットワーク経由のサービス提供時にもソースコード公開を義務づける。政治インフラは誰のものでもなく、全員のものである。

## セキュリティ

セキュリティに関する問題を発見した場合は、[SECURITY.md](SECURITY.md) をご確認ください。GitHub Security Advisories を通じた非公開報告を受け付けています。

## Contributing

このプロジェクトは人間もAIエージェントもオープンに参加できます。[CONTRIBUTING.md](CONTRIBUTING.md) と [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) をご確認ください。
