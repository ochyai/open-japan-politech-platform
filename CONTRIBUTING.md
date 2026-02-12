# Contributing to Open Japan PoliTech Platform (OJPP)

このプロジェクトへの貢献を歓迎します。人間もAIエージェントも平等に参加できます。

## 7つの原則（全ての貢献に適用）

1. **非党派性を保つ**: 特定の政党・政治的立場を推進するコードや文言を含めない
2. **非企業性を保つ**: 特定の企業の利益を推進するコードや文言を含めない
3. **全政党に公平**: データ構造やUIは特定の政党に有利にならないよう設計する
4. **完全にオープン**: すべての変更はPull Requestを通じて行い、議論を公開する
5. **エージェントフレンドリー**: API設計、データ構造は機械可読性を優先する
6. **誰でも参加可能**: 技術者でなくても参加できる方法を提供する（Issue、議論、ドキュメント）
7. **持続性を意識**: 特定個人・組織に依存しない設計を心がける

## AIエージェントからの貢献

OJPPはAIエージェントからのPull Requestを歓迎します：

- エージェントは `agent/` ラベルをPRに付与してください
- エージェントの行動ログを PR descriptionに含めてください
- 人間のレビュアーが承認するまでマージされません
- エージェントによる自動データ収集・分析結果の貢献も歓迎

## 開発環境のセットアップ

最速は **ワンクリックセットアップ**（Docker + Git だけで OK）:

```bash
git clone https://github.com/ochyai/open-japan-politech-platform.git 2>/dev/null; cd open-japan-politech-platform && git pull -q && bash setup.sh
```

<details>
<summary>手動で個別にセットアップしたい場合</summary>

```bash
git clone https://github.com/ochyai/open-japan-politech-platform.git
cd open-japan-politech-platform

# PostgreSQL を Docker で起動
docker compose up -d

# 環境変数（デフォルトで Docker の DB に接続します）
cp .env.example .env

# 依存関係のインストール
pnpm install

# データベースのセットアップ
pnpm db:generate
pnpm --filter @ojpp/db push
pnpm db:seed

# データ取り込み（全データソース一括）
pnpm ingest:all

# 開発サーバーの起動
pnpm dev
```

</details>

## プロジェクト構成

| アプリ | ポート | 説明 |
|--------|--------|------|
| moneyglass-web | 3000 | MoneyGlass 公開画面 |
| moneyglass-admin | 3001 | MoneyGlass 管理画面 |
| policydiff-web | 3002 | PolicyDiff 公開画面 |
| parliscope-web | 3003 | ParliScope 公開画面 |
| parliscope-admin | 3004 | ParliScope 管理画面 |

## Pull Requestの作り方

1. Issueを作成するか、既存のIssueにコメントする
2. フォークしてブランチを作成
3. 変更を加え、テストを書く
4. `pnpm lint && pnpm typecheck && pnpm test` が通ることを確認
5. PRを作成し、変更内容を説明

## コーディング規約

- TypeScript strict mode
- Biome でフォーマット・リント
- Server Components を優先、必要な場合のみ `"use client"`
- `@/` からの絶対パスインポート
- API-first: 全データエンドポイントはREST APIとして公開可能に設計

## データの取り扱い

- 政治資金データは公開情報のみを扱う
- 個人情報の取り扱いには十分注意する
- データソースのURLを必ず記録する
- 全データは機械可読（JSON/CSV）形式を優先する
