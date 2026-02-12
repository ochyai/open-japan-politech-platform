# Open Civic Platform

**政党によらない、政治のデジタル化オープンソース基盤**

政治参加のためのデジタルツールは、特定の政党に紐づくべきではない。政治資金の透明化、政策議論、議会参加——これらは民主主義のインフラであり、誰もが使えるオープンソースとして提供されるべきである。

## コンセプト

- **非党派性**: 特定の政党・政治団体に依存しない
- **透明性**: コードも運用もオープン。監視者が多数いる状態を作る
- **汎用性**: どの政治家・団体・市民グループでもフォークして使える
- **AIネイティブ**: AIエージェントによる政策分析・議論支援を前提に設計

## プロダクト

### 1. OpenFunds — 政治資金透明化プラットフォーム

政治家・政治団体の会計データを可視化し、市民が政治資金の流れを監視できるダッシュボード。

- 会計ソフト（MFクラウド・freee等）からのデータ取り込み
- 政治資金収支報告書の可視化
- 報告書XMLの自動生成
- 任意の政治家・団体が導入可能

### 2. OpenPolicy — Git駆動型政策議論プラットフォーム

政策をGitリポジトリで管理し、PRベースで市民からの提案を受け付ける仕組み。

- Markdownベースの政策文書管理
- Pull Requestによる政策変更提案
- AI熟議エンジンによる論点整理
- バージョン管理された政策の変遷追跡

### 3. OpenGikai — 議会参加プラットフォーム

法案の可視化・審議シミュレーション・市民参加型の議論を実現。

- 国会・地方議会の法案データ可視化
- 法案の難易度・影響分析
- 市民による模擬審議
- AIによる法案要約・論点抽出

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

## ディレクトリ構造

```
open-civic-platform/
├── apps/
│   ├── funds-web/        # OpenFunds 公開フロントエンド
│   ├── funds-admin/      # OpenFunds 管理画面
│   ├── policy-web/       # OpenPolicy フロントエンド
│   ├── gikai-web/        # OpenGikai 公開フロントエンド
│   └── gikai-admin/      # OpenGikai 管理画面
├── packages/
│   ├── ui/               # 共通UIコンポーネント
│   ├── db/               # Prismaスキーマ・DB共通
│   ├── config/           # 共通設定（ESLint, TypeScript等）
│   ├── auth/             # 認証共通モジュール
│   └── ai/               # AI連携共通モジュール
├── supabase/             # Supabase設定・マイグレーション
├── docs/                 # ドキュメント
└── .github/              # CI/CD
```

## なぜこれが必要か

政治のデジタル化と行政のデジタル化は異なる。行政DX（デジタル庁のマイナンバー等）は行政サービスの効率化であり、政治のデジタル化は**民主主義プロセスそのもの**のアップデートである。

現状、政治のデジタル化ツールは特定政党が自党のために開発しているケースが多い。しかし：

- 政治資金の透明化は全政党に求められるべき
- 政策議論のオープン化は民主主義の基盤
- 議会への市民参加は党派を超えた課題

これらのツールを**オープンソースのコモンズ**として提供することで、特定の政党に議席を与えなくても政治のデジタル化が進む状態を作る。

## ライセンス

AGPL-3.0 — 改変版も含めてオープンソースであり続けることを保証する。

## Contributing

このプロジェクトはオープンな貢献を歓迎します。詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
