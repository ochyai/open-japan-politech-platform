import { Card } from "@ojpp/ui";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="mb-6 text-3xl font-bold">MoneyGlassについて</h2>

      <div className="space-y-6">
        <Card>
          <h3 className="mb-3 text-xl font-bold">プロジェクト概要</h3>
          <p className="leading-relaxed text-gray-700">
            MoneyGlassは、Open Japan PoliTech Platform (OJPP) の一部として開発された、
            政治資金の透明化を目的としたオープンソースプラットフォームです。
            全政党・全政治団体の資金の流れを可視化し、
            AIエージェントによる24時間監視・分析を通じて、
            誰もが政治資金の実態にアクセスできる環境を目指しています。
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-xl font-bold">主な機能</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>政治資金収支報告書データの収集・構造化</li>
            <li>政党別・団体別の資金フローの可視化</li>
            <li>年度別収支推移のグラフ表示</li>
            <li>収入・支出の内訳分析（カテゴリ別円グラフ）</li>
            <li>オープンAPIによるデータアクセス</li>
          </ul>
        </Card>

        <Card>
          <h3 className="mb-3 text-xl font-bold">データソース</h3>
          <p className="leading-relaxed text-gray-700">
            本プラットフォームのデータは、総務省および各都道府県選挙管理委員会が
            公開する政治資金収支報告書に基づいています。
            現在はサンプルデータを使用していますが、
            将来的にはpolitical-finance-database.com等の公開データベースとの連携を予定しています。
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-xl font-bold">技術スタック</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Next.js (App Router / React Server Components)</li>
            <li>Prisma ORM + PostgreSQL</li>
            <li>Tailwind CSS v4</li>
            <li>Recharts（データ可視化）</li>
            <li>TypeScript (Strict mode)</li>
          </ul>
        </Card>

        <Card>
          <h3 className="mb-3 text-xl font-bold">ライセンス</h3>
          <p className="leading-relaxed text-gray-700">
            本プロジェクトはAGPL-3.0ライセンスの下で公開されています。
            政党にも企業にもよらない、完全にオープンな政治テクノロジー基盤として、
            誰でも自由に利用・改変・再配布が可能です。
          </p>
        </Card>
      </div>
    </div>
  );
}
