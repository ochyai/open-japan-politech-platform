# Open Japan PoliTech Platform (OJPP)

**政党によらない、企業によらない、完全オープンな政治テクノロジー基盤**

## PoliTechとは

PoliTech（Political Technology）は、CivicTech（市民技術）やGovTech（行政技術）とは異なる第三の概念である。CivicTechが市民参加の促進を、GovTechが行政サービスの効率化を目的とするのに対し、PoliTechは**政治の意思決定プロセスそのもの**をテクノロジーで再構築することを目指す。

## 7つの原則

1. **非党派性** — 特定の政党・政治団体に依存しない。いかなる政党の代弁者にもならない
2. **非企業性** — 企業が運営しない。企業の代弁者にもならない。完全にコミュニティ主導
3. **完全オープン** — コード、データ、意思決定プロセスの全てがオープン。AGPLライセンス
4. **誰でも参加** — 技術者でなくても、どの政治的立場からでも参加できる
5. **エージェントレディ** — AIエージェントの参加を前提に設計。API-first、機械可読データ
6. **議席不要** — 政治のデジタル化のために議席を取る必要はない。インフラは市民が作る
7. **持続性** — 政権交代・組織変更に左右されない。フォーク可能で分散的

## なぜ PoliTech が必要か

| | GovTech（行政DX） | CivicTech（市民技術） | **PoliTech（政治技術）** |
|---|---|---|---|
| **問い** | 決まった政策をいかに届けるか | 市民がいかに参加するか | **何を誰がどう決めるか** |
| **主体** | 政府 | 市民社会 | **市民 + AIエージェント** |
| **対象** | 行政サービス | 市民参加 | **政治の意思決定プロセス** |
| **例** | マイナンバー、X-Road | Code for Japan、FixMyStreet | **OJPP、vTaiwan、Decidim** |

政治のデジタル化を政党に任せると、プラットフォームに党派性バイアスが組み込まれる。企業に任せると、利益相反が生じる。だから、**完全にオープンなコミュニティが、AIエージェントと共に、政治インフラを構築する**。

## プロダクト

### 1. PoliMoney — 全政党政治資金透明化プラットフォーム

全ての政党・政治団体の会計データを可視化。特定政党だけでなく全政治団体が対象。

- 全政党の政治資金収支報告書の構造化データ
- APIによる機械可読データの提供（AIエージェント対応）
- サンキーダイアグラムによるフロー可視化
- 3年削除問題に対する永続アーカイブ

### 2. PoliPolicy — Git駆動型全政党政策比較プラットフォーム

全政党のマニフェスト・政策をGitで管理し、市民とAIエージェントが分析・比較。

- 全政党のマニフェストを並列比較
- Pull Requestによる市民からの政策提案
- AIエージェントによる論点抽出・影響分析
- バージョン管理された政策の変遷追跡

### 3. PoliGikai — 議会オープンデータ＆参加プラットフォーム

国会・地方議会のデータをAPI化し、市民とAIエージェントが利用可能に。

- 国会・地方議会の法案データAPI
- AIエージェントによる法案要約・論点抽出
- 市民による模擬審議・意見表明
- 投票記録の構造化データベース

## エージェントレディ設計

OJPPは人間だけでなくAIエージェントの参加を前提に設計される：

- **API-First**: 全データをRESTful API / GraphQLで提供
- **機械可読データ**: JSON-LD、構造化データを標準
- **エージェント認証**: AIエージェント用の認証・権限管理
- **MCP対応**: Model Context Protocol による外部AIとの連携
- **監査ログ**: 全操作のトレーサビリティを保証

## 技術スタック

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm (monorepo)
- **Linter/Formatter**: Biome
- **Testing**: Vitest
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel / Cloudflare Pages
- **AI/Agent**: MCP, LangChain, OpenAI API

## ディレクトリ構造

```
open-japan-politech-platform/
├── apps/
│   ├── polimoney-web/     # PoliMoney 公開フロントエンド
│   ├── polimoney-admin/   # PoliMoney 管理画面
│   ├── polipolicy-web/    # PoliPolicy フロントエンド
│   ├── poligikai-web/     # PoliGikai 公開フロントエンド
│   └── poligikai-admin/   # PoliGikai 管理画面
├── packages/
│   ├── ui/                # 共通UIコンポーネント
│   ├── db/                # Prismaスキーマ・DB共通
│   ├── api/               # API共通モジュール（エージェント対応）
│   ├── auth/              # 認証共通モジュール（人間+エージェント）
│   └── ai/                # AI連携共通モジュール
├── agents/                # AIエージェント定義・設定
├── supabase/              # Supabase設定・マイグレーション
├── paper/                 # 学術論文
├── docs/                  # ドキュメント
└── .github/               # CI/CD
```

## 既存プロジェクトとの関係

OJPPは以下のプロジェクトの成果を参照しつつ、非党派・非企業・エージェントレディな汎用基盤として再設計する：

| プロジェクト | 関係 |
|---|---|
| チームみらい（まる見え政治資金等） | 技術的参考。ただし政党紐づきのため、OJPPは全政党対応の汎用版 |
| DD2030（Polimoney等） | 方向性は近い。OJPPはエージェントレディ設計を追加 |
| g0v / vTaiwan | 台湾モデルの日本版。市民社会主導の非党派アプローチを踏襲 |
| Decidim / Consul | 欧州の参加型民主主義基盤。モジュラー設計を参考 |
| mySociety | 英国のNGOモデル。20年+の持続性を参考 |

## ライセンス

AGPL-3.0 — 改変版も含めてオープンソースであり続けることを保証する。ネットワーク経由のサービス提供時にもソースコード公開を義務づける。

## Contributing

このプロジェクトは人間もAIエージェントもオープンに参加できます。詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
