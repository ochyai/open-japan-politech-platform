import { Card, Badge } from "@ojpp/ui";

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/policies",
    description: "政策一覧を取得",
    params: [
      { name: "party", type: "string", description: "政党名でフィルタ" },
      { name: "category", type: "string", description: "カテゴリでフィルタ" },
      { name: "status", type: "string", description: "ステータスでフィルタ (DRAFT|PUBLISHED|ARCHIVED)" },
      { name: "page", type: "number", description: "ページ番号 (default: 1)" },
      { name: "limit", type: "number", description: "1ページあたりの件数 (default: 20, max: 100)" },
    ],
  },
  {
    method: "GET",
    path: "/api/policies/:id",
    description: "政策詳細を取得（政党情報・変更提案を含む）",
    params: [
      { name: "id", type: "string", description: "政策ID (path parameter)" },
    ],
  },
  {
    method: "GET",
    path: "/api/parties",
    description: "政党一覧を取得（各カテゴリの政策件数付き）",
    params: [],
  },
  {
    method: "GET",
    path: "/api/compare",
    description: "政策比較（同カテゴリの複数政党の政策を取得）",
    params: [
      { name: "category", type: "string", description: "カテゴリ名 (required)" },
      { name: "parties", type: "string", description: "政党名のカンマ区切り" },
    ],
  },
  {
    method: "GET",
    path: "/api/proposals",
    description: "政策変更提案一覧を取得",
    params: [
      { name: "status", type: "string", description: "ステータスでフィルタ (OPEN|UNDER_REVIEW|ACCEPTED|REJECTED|WITHDRAWN)" },
      { name: "page", type: "number", description: "ページ番号" },
      { name: "limit", type: "number", description: "1ページあたりの件数" },
    ],
  },
  {
    method: "GET",
    path: "/api/categories",
    description: "カテゴリ一覧を取得（各カテゴリの政策件数付き）",
    params: [],
  },
];

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold">API ドキュメント</h2>
      <p className="mb-8 text-gray-600">
        PolicyDiffのRESTful APIを使って、政策データにプログラムからアクセスできます。
        すべてのエンドポイントはCORS対応済みです。
      </p>

      <div className="mb-8">
        <Card padding="sm">
          <h3 className="mb-2 text-sm font-bold text-gray-500">ベースURL</h3>
          <code className="rounded bg-gray-100 px-2 py-1 text-sm">
            http://localhost:3002/api
          </code>
        </Card>
      </div>

      <div className="space-y-6">
        {API_ENDPOINTS.map((endpoint) => (
          <Card key={endpoint.path}>
            <div className="mb-3 flex items-center gap-3">
              <Badge variant="success">{endpoint.method}</Badge>
              <code className="text-sm font-medium">{endpoint.path}</code>
            </div>
            <p className="mb-4 text-sm text-gray-600">{endpoint.description}</p>
            {endpoint.params.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-bold text-gray-500">パラメータ</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500">
                      <th className="pb-2 pr-4">名前</th>
                      <th className="pb-2 pr-4">型</th>
                      <th className="pb-2">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.params.map((param) => (
                      <tr key={param.name} className="border-b last:border-0">
                        <td className="py-2 pr-4">
                          <code className="rounded bg-gray-100 px-1 text-xs">{param.name}</code>
                        </td>
                        <td className="py-2 pr-4 text-xs text-gray-500">{param.type}</td>
                        <td className="py-2 text-xs text-gray-600">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <h3 className="mb-3 text-lg font-bold">レスポンス形式</h3>
          <p className="mb-3 text-sm text-gray-600">
            ページネーション付きのエンドポイントは以下の形式でレスポンスを返します。
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
{`{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
