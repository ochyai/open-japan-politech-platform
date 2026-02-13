<div align="center">

# Open Japan PoliTech Platform

**AIエージェント時代の政治インフラ**

政党にも企業にもよらない、完全オープンな政治テクノロジー基盤

[![CI](https://github.com/ochyai/open-japan-politech-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/ochyai/open-japan-politech-platform/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Apps](https://img.shields.io/badge/apps-8-FF6B35.svg)](#6-apps)
[![Models](https://img.shields.io/badge/Prisma_models-29-5B21B6.svg)](#data-model)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)](https://nextjs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[**1行で起動**](#1-line-setup) | [**6つのアプリ**](#6-apps) | [**API仕様**](#api) | [**論文**](#paper) | [**Contributing**](#contributing)

</div>

---

> [!NOTE]
> **v0.1 のデータは公的機関の公開資料に基づく実データです。** 詳細は[データソース・根拠一覧](docs/DATA_SOURCES.md)を参照してください。

<a id="1-line-setup"></a>

## 1行で起動

```bash
git clone https://github.com/ochyai/open-japan-politech-platform.git && cd open-japan-politech-platform && bash setup.sh
```

> **必要なもの**: [Docker](https://docs.docker.com/get-docker/) と [Git](https://git-scm.com/) だけ。Node.js / pnpm は自動インストールされます。
>
> 停止 `Ctrl+C` / 再起動 `bash setup.sh` / DB削除 `docker compose down -v`

---

## なぜ PoliTech か

政治は長く、政党と企業の専有物だった。

**AIエージェントの時代が、この構造を変える。**

あなたのAIエージェントが、24時間365日、全政党の政治資金を監視する。全政党の政策変更を追跡し、差分を届ける。全法案を読み、あなたに影響のある部分を要約する。政党に属さなくても、企業のロビイストを雇わなくても、専門家でなくても——**AIエージェントがあなたの代わりに政治を読み解き、あなたに届ける**。

GovTech（行政DX）でもCivicTech（市民技術）でもない。**政治の意思決定プロセスそのものを、すべての人に開くテクノロジー**。

<table>
<tr><th></th><th>GovTech</th><th>CivicTech</th><th><strong>PoliTech</strong></th></tr>
<tr><td><strong>問い</strong></td><td>決まった政策をいかに届けるか</td><td>市民がいかに参加するか</td><td><strong>AIエージェント時代に、誰もが政治プロセスを実行・享受するには</strong></td></tr>
<tr><td><strong>主体</strong></td><td>政府</td><td>市民社会</td><td><strong>市民 + AIエージェント</strong></td></tr>
<tr><td><strong>時代</strong></td><td>電子政府時代</td><td>Web 2.0時代</td><td><strong>AIエージェント時代</strong></td></tr>
</table>

### 7つの原則

> **1** エージェントファースト — AIの参加を前提に設計
> **2** 非党派性 — 全政党を等しく扱う
> **3** 非企業性 — 企業が運営しない
> **4** 完全オープン — AGPL-3.0
> **5** 誰でも参加 — 人間でもAIでも
> **6** 議席不要 — インフラは市民とエージェントが作る
> **7** 持続性 — フォーク可能で分散的

---

<a id="6-apps"></a>

## 6 Apps

<table>
<tr>
<td width="50%">

### MoneyGlass `:3000`
**政治資金を、ガラスのように透明に**

<img src="docs/screenshots/moneyglass-preview.svg" alt="MoneyGlass Preview" width="100%"/>

全政党・全政治団体の資金の流れを可視化。収支報告書を構造化し、収入9カテゴリ・支出8カテゴリで分類。グラデーション付き棒グラフ・ドーナツチャートで政治資金の実態にアクセス。

`13政党` `8年分` `政治資金収支報告書`

</td>
<td width="50%">

### PolicyDiff `:3002`
**全政党の政策を、差分で比較する**

<img src="docs/screenshots/policydiff-preview.svg" alt="PolicyDiff Preview" width="100%"/>

全15政党のマニフェスト・政策を10カテゴリに分類し、政党間の比較を可能にする。カテゴリ別・政党別フィルタリング、政党カラーチップによる直感的UI、市民からの政策提案機能。

`15政党` `10カテゴリ` `マニフェスト比較`

</td>
</tr>
<tr>
<td width="50%">

### ParliScope `:3003`
**議会を、すべての人とエージェントに開く**

<img src="docs/screenshots/parliscope-preview.svg" alt="ParliScope Preview" width="100%"/>

国会の会期・法案・議員・投票・討論データをAPI化。21会期分のデータを構造化し、法案タイムライン、投票結果アニメーション棒グラフ、議員カード一覧で法案追跡と議員分析が可能。

`90法案` `713議員` `21会期`

</td>
<td width="50%">

### SeatMap `:3005`
**議会の勢力図を、ひと目で把握する**

<img src="docs/screenshots/seatmap-preview.svg" alt="SeatMap Preview" width="100%"/>

国会の議席構成・政党別勢力を視覚的に表示。スプリング物理に基づくアニメーテッドバーで議席数の変動や与野党の勢力バランスを直感的に理解。過半数ラインdraw-in付き。

`衆参両院` `9選挙` `スプリング物理`

</td>
</tr>
<tr>
<td width="50%">

### CultureScope `:3006`
**文化を、政治の言語で読み解く**

<img src="docs/screenshots/culturescope-preview.svg" alt="CultureScope Preview" width="100%"/>

文化庁予算の推移（2019-2026）、芸術振興・文化財保護・メディア芸術等12分野の予算配分、各政党の文化政策スタンスを一覧比較。20の文化プログラム・補助金制度データベース。

`96予算データ` `20プログラム` `13政党スタンス`

</td>
<td width="50%">

### SocialGuard `:3007`
**社会保障の全体像を、ひと目で**

<img src="docs/screenshots/socialguard-preview.svg" alt="SocialGuard Preview" width="100%"/>

年金・医療・介護・子育て支援・生活保護——40兆円規模の社会保障関係費を8分野で可視化。47都道府県別福祉指標比較、各政党の社会保障政策スタンス比較。

`64予算データ` `15制度` `47都道府県` `13政党スタンス`

</td>
</tr>
</table>

> **管理画面**: `moneyglass-admin` `:3001` / `parliscope-admin` `:3004`

---

## アーキテクチャ

```
                          ブラウザ / AIエージェント / MCP
                                      │
          ┌───────┬───────┬───────┬────┴────┬──────────┬──────────┐
          ▼       ▼       ▼       ▼         ▼          ▼          │
      MoneyGlass PolicyDiff ParliScope SeatMap CultureScope SocialGuard
       :3000      :3002     :3003    :3005    :3006      :3007     │
       ┌──────────────────────────────────────────────────────┐    │
       │              Next.js 15  ×  React 19                 │    │
       └────────────────────────┬─────────────────────────────┘    │
                                │                              admin apps
       ┌────────────────────────┼─────────────────────────────┐ :3001/:3004
       │  @ojpp/ui  │  @ojpp/api  │  @ojpp/db  │  @ojpp/ingestion │
       └────────────────────────┬─────────────────────────────┘
                                │
                    PostgreSQL (Prisma 6)
                 29 models │ 14 enums │ 13政党
```

---

## クイックスタート

### 個別起動

```bash
pnpm dev:moneyglass    # MoneyGlass   :3000 + :3001
pnpm dev:policydiff    # PolicyDiff   :3002
pnpm dev:parliscope    # ParliScope   :3003 + :3004
pnpm dev:seatmap       # SeatMap      :3005
pnpm dev:culturescope  # CultureScope :3006
pnpm dev:socialguard   # SocialGuard  :3007
```

<details>
<summary><strong>手動セットアップ</strong></summary>

**前提条件**: Node.js 22+ / pnpm 10+ / PostgreSQL

```bash
git clone https://github.com/ochyai/open-japan-politech-platform.git
cd open-japan-politech-platform
docker compose up -d
cp .env.example .env
pnpm install && pnpm db:generate && pnpm --filter @ojpp/db push && pnpm db:seed
pnpm ingest:all
pnpm dev
```

</details>

### コマンド一覧

| コマンド | 説明 |
|:---|:---|
| `pnpm build` | プロダクションビルド（全8アプリ） |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm test` | Vitest テスト実行 |
| `pnpm lint` | Biome lint |
| `pnpm db:studio` | Prisma Studio（DB GUI） |
| `pnpm db:generate` | Prisma Client 再生成 |
| `pnpm ingest:all` | 全データ一括投入 |
| `pnpm ingest:culture` | 文化政策データ投入 |
| `pnpm ingest:social` | 社会保障データ投入 |

---

<a id="api"></a>

## API

全APIはRESTful JSONを返し、ページネーション `?page=1&limit=20` に対応。

<details>
<summary><strong>MoneyGlass API</strong> <code>:3000</code></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/organizations` | 政治団体一覧 |
| GET | `/api/organizations/:id` | 団体詳細 |
| GET | `/api/reports` | 報告書一覧 |
| GET | `/api/reports/:id` | 報告書詳細（収支明細含む） |
| GET | `/api/parties` | 政党一覧（資金集計付き） |
| GET | `/api/stats` | ダッシュボード統計 |

</details>

<details>
<summary><strong>PolicyDiff API</strong> <code>:3002</code></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/policies` | 政策一覧 |
| GET | `/api/policies/:id` | 政策詳細 |
| GET | `/api/parties` | 政党一覧 |
| GET | `/api/compare` | 政策比較 |
| GET | `/api/proposals` | 提案一覧 |
| GET | `/api/categories` | カテゴリ一覧 |

</details>

<details>
<summary><strong>ParliScope API</strong> <code>:3003</code></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/sessions` | 会期一覧 |
| GET | `/api/sessions/:id` | 会期詳細 + 法案 |
| GET | `/api/bills` | 法案一覧 |
| GET | `/api/bills/:id` | 法案詳細（投票・議論含む） |
| GET | `/api/politicians` | 議員一覧 |
| GET | `/api/politicians/:id` | 議員詳細 + 投票履歴 |
| GET | `/api/stats` | ダッシュボード統計 |

</details>

<details>
<summary><strong>CultureScope API</strong> <code>:3006</code></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/budgets` | 文化庁予算一覧 |
| GET | `/api/programs` | 文化プログラム一覧 |
| GET | `/api/stances` | 政党別文化政策スタンス |

</details>

<details>
<summary><strong>SocialGuard API</strong> <code>:3007</code></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/budgets` | 社会保障予算一覧 |
| GET | `/api/programs` | 社会保障制度一覧 |
| GET | `/api/welfare-stats` | 都道府県別福祉指標 |
| GET | `/api/stances` | 政党別社会保障スタンス |

</details>

---

<a id="data-model"></a>

## Data Model

Prisma 6 — **29 models**, **14 enums**

```
  Party ◄─── CulturalStance          DietSession ──► Bill ──► Vote
    │    ◄── SocialSecurityStance         │               └──► Discussion
    │                                     │
    ├──► Politician ──► Vote          Election ──► ElectionResult
    │        │
    ├──► PoliticalOrganization        CulturalBudget
    │        └──► FundReport          CulturalProgram
    │              ├──► FundIncome
    │              └──► FundExpenditure   SocialSecurityBudget
    │                                     SocialSecurityProgram
    └──► Policy ──► PolicyProposal
                                      Prefecture ──► WelfareStat
```

<details>
<summary><strong>データの性質と件数</strong></summary>

| データ | 性質 | 件数 | ソース |
|:---|:---|:---|:---|
| 政党マスタ | 実データ | 23政党 | 総務省 政党名簿 |
| 都道府県 | 実データ | 47 | JIS X 0401 |
| 衆議院議員 | 実データ | 465名 | 総務省 第50回衆院選結果 |
| 参議院議員 | 実データ | 248名 | 参議院公式 |
| 選挙結果 | 実データ | 9選挙 | 総務省選挙結果 |
| 国会会期 | 実データ | 21会期 | 衆議院公式 |
| 法案 | 実データ | 90件 | 衆議院・参議院議案一覧 |
| 政治資金 | 実データ | 13政党×8年 | 総務省 政治資金収支報告書 |
| 文化庁予算 | 実データ | 12分野×8年 | 文化庁予算概要 |
| 文化プログラム | 実データ | 20件 | 文化庁公開資料 |
| 社会保障予算 | 実データ | 8分野×8年 | 厚生労働省・財務省 |
| 社会保障制度 | 実データ | 15件 | 厚生労働省 |
| 都道府県別福祉指標 | 実データ | 47×3指標 | 総務省統計局 |
| 政党別スタンス | デモデータ | 13政党×12トピック | 各党マニフェスト参照 |

</details>

### データソース

| データ | ソース | 取り込み |
|:---|:---|:---|
| 政治資金 | [political-finance-database.com](https://political-finance-database.com) | `pnpm ingest:finance` |
| 国会会議録 | [国会会議録API](https://kokkai.ndl.go.jp/) (CC BY 4.0) | `pnpm ingest:parliament` |
| 法案データ | [SmartNews SMRI](https://github.com/smartnews-smri) (MIT) | `pnpm ingest:parliament` |
| マニフェスト | 各政党公式サイト | `pnpm ingest:manifesto` |
| 文化政策 | 文化庁予算概要・各党マニフェスト | `pnpm ingest:culture` |
| 社会保障 | 厚生労働省・財務省・総務省統計局 | `pnpm ingest:social` |

---

## エージェントファースト設計

| 設計原則 | 詳細 |
|:---|:---|
| **API-First** | 全データをRESTful APIで提供。エージェントが直接アクセス |
| **機械可読データ** | JSON構造化データを標準。人間用UIとエージェント用APIの両方 |
| **エージェント認証** *(v0.2)* | AIエージェント用の認証・権限管理 |
| **MCP対応** *(v0.2)* | Model Context Protocol による外部AIとの連携 |
| **監査ログ** *(v0.2)* | 全操作のトレーサビリティ。エージェントの行動も透明 |

---

## AIエージェントで開発する

このリポジトリを clone して Claude Code を起動するだけ。

```bash
cd open-japan-politech-platform && claude
```

```
open-japan-politech-platform/
├── apps/                              ← Next.js 15 アプリ
│   ├── moneyglass-web/       :3000       政治資金
│   ├── moneyglass-admin/     :3001       管理画面
│   ├── policydiff-web/       :3002       政策比較
│   ├── parliscope-web/       :3003       国会
│   ├── parliscope-admin/     :3004       管理画面
│   ├── seatmap-web/          :3005       議席勢力図
│   ├── culturescope-web/     :3006       文化政策
│   └── socialguard-web/      :3007       社会保障
├── packages/
│   ├── ui/                            @ojpp/ui  — 14+ コンポーネント + Motion + Lenis
│   ├── db/                            @ojpp/db  — Prisma (29 models / 14 enums)
│   ├── api/                           @ojpp/api — ページネーション, エラー, BigInt変換
│   └── ingestion/                     @ojpp/ingestion — 6データソース取り込み
├── paper/                             学術論文
└── docs/                              ドキュメント
```

**コーディング規約**: TypeScript strict / Biome lint / Server Components優先 / API-first

---

## 技術スタック

| Layer | Tech |
|:---|:---|
| **Frontend** | Next.js 15 (App Router) / React 19 / TypeScript 5.9 |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma 6 |
| **Styling** | Tailwind CSS v4 |
| **Design System** | @ojpp/ui — 14+ コンポーネント / カスタムテーマ |
| **Animation** | Motion (v11+) — スプリング物理 / スクロールトリガー / ページ遷移 |
| **Smooth Scroll** | Lenis — 慣性スクロール / 60fps |
| **Charts** | Recharts |
| **Monorepo** | pnpm 10 workspaces + Turborepo |
| **Lint / Format** | Biome 2.3 |
| **Test** | Vitest 3 |
| **CI/CD** | GitHub Actions |

---

## ロードマップ

- [x] Prismaスキーマ (29モデル / 14 enum)
- [x] 8アプリ MVP (API + フロントエンド)
- [x] データ取り込みパイプライン (6データソース)
- [x] CI/CD パイプライン
- [x] デザインシステム (@ojpp/ui + Motion + Lenis)
- [x] 学術論文 (PoliTech 5地域比較分析)
- [x] CultureScope — 文化政策可視化
- [x] SocialGuard — 社会保障可視化
- [x] Vercel デプロイ
- [ ] 認証・認可 (Supabase Auth)
- [ ] AIエージェント認証 (APIキー / MCP)
- [ ] GraphQL API
- [ ] リアルタイム通知
- [ ] 多言語対応 (英語)

---

## 関連プロジェクト

| プロジェクト | 関係 |
|:---|:---|
| **g0v / vTaiwan** | 台湾モデルの日本版。市民社会主導の非党派アプローチを踏襲 |
| **Decidim / Consul** | 欧州の参加型民主主義基盤。モジュラー設計を参考 |
| **mySociety** | 英国のNGOモデル。20年+の持続性を参考 |
| **チームみらい** | 技術的参考。本プラットフォームは全政党対応の非党派版 |
| **DD2030** | 方向性は近い。本プラットフォームはエージェントファースト設計を追加 |

---

<a id="paper"></a>

## 論文

> **PoliTech：政党にも企業にもよらない政治のデジタル化——オープンソース・エージェントレディな政治テクノロジー基盤の国際比較分析**
>
> 台湾・英国・米国・欧州・日本の5地域を6軸比較フレームワークで分析。

[paper.pdf](paper/paper.pdf) / [paper.md](paper/paper.md)

---

## UX / アニメーション

> **「ぬるぬるカッコいい」** — 政治データを、触って気持ちいいUIで届ける

全アプリに [Motion](https://motion.dev/) と [Lenis](https://lenis.darkroom.engineering/) による滑らかなアニメーションを実装。

| 機能 | 技術 | 体験 |
|:---|:---|:---|
| スムーススクロール | Lenis 慣性スクロール | 全ページが60fpsでぬるぬる |
| ページ遷移 | `PageTransition` | フェード＋スライドアップ |
| スクロールリビール | `useInView` + `ScrollReveal` | セクションがスクロールで出現 |
| カードスタッガー | `StaggerGrid` + `StaggerItem` | カードが順番に時差表示 |
| データバー | Spring物理 (stiffness:60) | 議席バー・投票バーがバネで伸びる |
| グラスモーフィズム | Scroll-dependent backdrop-blur | ナビバーが半透明ガラス化 |
| ホバーリフト | `whileHover` + boxShadow | カードが浮き上がる |
| タップフィードバック | `whileTap` scale(0.97) | ボタンがバネで縮む |
| パララックス | `useScroll` + `useTransform` | Hero背景がパララックス移動 |

---

<a id="contributing"></a>

## Contributing

人間もAIエージェントもオープンに参加できます。[CONTRIBUTING.md](CONTRIBUTING.md) / [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) / [SECURITY.md](SECURITY.md)

AIエージェントからのPull Requestも歓迎します。`agent/` ラベルを付けてPRを送ってください。

---

<div align="center">

**[AGPL-3.0](LICENSE)** — 政治インフラは誰のものでもなく、全員のものである。

</div>
