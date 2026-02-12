import { Card } from "@ojpp/ui";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/organizations",
    description: "政治団体の一覧を取得",
    params: [
      { name: "party", type: "string", description: "政党IDでフィルタ" },
      { name: "type", type: "string", description: "団体種別でフィルタ (PARTY_BRANCH | FUND_MANAGEMENT)" },
      { name: "page", type: "number", description: "ページ番号 (デフォルト: 1)" },
      { name: "limit", type: "number", description: "1ページの件数 (デフォルト: 20, 最大: 100)" },
    ],
  },
  {
    method: "GET",
    path: "/api/organizations/:id",
    description: "政治団体の詳細を取得（収支報告書一覧を含む）",
  },
  {
    method: "GET",
    path: "/api/reports",
    description: "収支報告書の一覧を取得",
    params: [
      { name: "year", type: "number", description: "会計年度でフィルタ" },
      { name: "organizationId", type: "string", description: "団体IDでフィルタ" },
      { name: "page", type: "number", description: "ページ番号" },
      { name: "limit", type: "number", description: "1ページの件数" },
    ],
  },
  {
    method: "GET",
    path: "/api/reports/:id",
    description: "収支報告書の詳細を取得（収入・支出の明細を含む）",
  },
  {
    method: "GET",
    path: "/api/parties",
    description: "政党一覧を取得（totalIncome / totalExpenditure 集計付き）",
  },
  {
    method: "GET",
    path: "/api/stats",
    description: "ダッシュボード統計を取得（団体数、報告書数、総収支、年度別推移）",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-bold">API ドキュメント</h2>
      <p className="mb-8 text-gray-600">
        MoneyGlass APIは、政治資金データへのプログラムによるアクセスを提供します。
        全てのエンドポイントはRESTful JSON APIです。
      </p>

      <div className="mb-8">
        <Card>
          <h3 className="mb-2 font-bold">Base URL</h3>
          <code className="rounded bg-gray-100 px-2 py-1 text-sm">
            https://your-domain.com/api
          </code>
          <h3 className="mb-2 mt-4 font-bold">レスポンス形式</h3>
          <p className="text-sm text-gray-600">
            一覧APIはページネーション付きで返却されます:
          </p>
          <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-green-400">
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

      <div className="space-y-4">
        {ENDPOINTS.map((endpoint) => (
          <Card key={endpoint.path}>
            <div className="flex items-center gap-3">
              <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                {endpoint.method}
              </span>
              <code className="text-sm font-medium">{endpoint.path}</code>
            </div>
            <p className="mt-2 text-sm text-gray-600">{endpoint.description}</p>
            {endpoint.params && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500">クエリパラメータ</p>
                <table className="mt-1 w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs text-gray-500">
                      <th className="py-1 pr-4">名前</th>
                      <th className="py-1 pr-4">型</th>
                      <th className="py-1">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.params.map((param) => (
                      <tr key={param.name} className="border-b last:border-0">
                        <td className="py-1 pr-4">
                          <code className="text-xs">{param.name}</code>
                        </td>
                        <td className="py-1 pr-4 text-xs text-gray-500">{param.type}</td>
                        <td className="py-1 text-xs text-gray-600">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
