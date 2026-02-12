# Contributing to Open Civic Platform

このプロジェクトへの貢献を歓迎します。

## 基本原則

1. **非党派性を保つ**: 特定の政党・政治的立場を推進するコードや文言を含めない
2. **全政党に公平**: データ構造やUIは特定の政党に有利にならないよう設計する
3. **透明性**: すべての変更はPull Requestを通じて行い、議論を公開する

## 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/ochyai/open-civic-platform.git
cd open-civic-platform

# 依存関係のインストール
pnpm install

# Supabaseの起動
npx supabase start

# 環境変数の設定
cp .env.example .env

# データベースのセットアップ
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 開発サーバーの起動
pnpm dev
```

## プロジェクト構成

| アプリ | ポート | 説明 |
|--------|--------|------|
| funds-web | 3000 | OpenFunds 公開画面 |
| funds-admin | 3001 | OpenFunds 管理画面 |
| policy-web | 3002 | OpenPolicy 公開画面 |
| gikai-web | 3003 | OpenGikai 公開画面 |
| gikai-admin | 3004 | OpenGikai 管理画面 |

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

## データの取り扱い

- 政治資金データは公開情報のみを扱う
- 個人情報の取り扱いには十分注意する
- データソースのURLを必ず記録する
