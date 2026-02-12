import { Card } from "@ojpp/ui";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: string[];
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/sessions",
    description: "会期一覧を取得（ページネーション対応）",
    params: ["page", "limit"],
  },
  {
    method: "GET",
    path: "/api/sessions/:id",
    description: "会期詳細を取得（法案一覧含む）",
  },
  {
    method: "GET",
    path: "/api/bills",
    description: "法案一覧を取得（フィルタ・ページネーション対応）",
    params: ["page", "limit", "status", "sessionId", "category"],
  },
  {
    method: "GET",
    path: "/api/bills/:id",
    description: "法案詳細を取得（投票・議論含む）",
  },
  {
    method: "GET",
    path: "/api/politicians",
    description: "議員一覧を取得（フィルタ・ページネーション対応）",
    params: ["page", "limit", "party", "chamber", "prefecture"],
  },
  {
    method: "GET",
    path: "/api/politicians/:id",
    description: "議員詳細を取得（投票履歴含む）",
  },
  {
    method: "GET",
    path: "/api/stats",
    description: "ダッシュボード統計データを取得",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="mb-2 text-2xl font-bold">API ドキュメント</h2>
      <p className="mb-8 text-gray-600">
        ParliScope APIはRESTful設計で、JSON形式でデータを返します。認証不要で自由に利用できます。
      </p>

      <div className="mb-8">
        <Card>
          <h3 className="mb-2 font-semibold">共通レスポンス形式（ページネーション）</h3>
          <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-sm text-green-400">
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
        {ENDPOINTS.map((ep) => (
          <Card key={ep.path} padding="sm">
            <div className="flex items-center gap-3">
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                {ep.method}
              </span>
              <code className="text-sm font-medium">{ep.path}</code>
            </div>
            <p className="mt-2 text-sm text-gray-600">{ep.description}</p>
            {ep.params && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">パラメータ: </span>
                {ep.params.map((p) => (
                  <code
                    key={p}
                    className="mr-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
                  >
                    {p}
                  </code>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
