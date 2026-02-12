import { Card } from "@ojpp/ui";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-bold">ParliScopeについて</h2>

      <div className="space-y-6">
        <Card>
          <h3 className="mb-3 text-lg font-semibold">ミッション</h3>
          <p className="text-gray-700">
            ParliScopeは、国会・地方議会のデータをオープンにし、AIエージェントと市民が
            議会の動きをリアルタイムに把握できるプラットフォームです。
            政党にも企業にもよらない、完全オープンな政治テクノロジー基盤を目指します。
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-lg font-semibold">主な機能</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>国会法案の一覧・詳細閲覧</li>
            <li>会期別の法案整理</li>
            <li>議員の投票行動追跡</li>
            <li>ステータス別の法案フィルタリング</li>
            <li>RESTful APIによるデータアクセス</li>
          </ul>
        </Card>

        <Card>
          <h3 className="mb-3 text-lg font-semibold">データソース</h3>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>国会会議録検索システムAPI (kokkai.ndl.go.jp)</li>
            <li>衆議院・参議院公式サイト</li>
            <li>SmartNews SMRI 法案データ</li>
          </ul>
        </Card>

        <Card>
          <h3 className="mb-3 text-lg font-semibold">オープンソース</h3>
          <p className="text-gray-700">
            本プロジェクトはAGPL-3.0ライセンスのもとで公開されています。
            Open Japan PoliTech Platformの一部として開発されています。
          </p>
        </Card>
      </div>
    </div>
  );
}
