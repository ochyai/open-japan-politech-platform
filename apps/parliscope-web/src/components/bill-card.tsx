import { Card } from "@ojpp/ui";
import { BillStatusBadge } from "./bill-status-badge";

interface BillCardProps {
  id: string;
  number: string;
  title: string;
  summary?: string | null;
  proposer?: string | null;
  category?: string | null;
  status: string;
  submittedAt?: string | null;
}

export function BillCard({ id, number, title, summary, proposer, category, status, submittedAt }: BillCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">{number}</span>
            <BillStatusBadge status={status} />
            {category && (
              <span className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{category}</span>
            )}
          </div>
          <a href={`/bills/${id}`} className="text-lg font-semibold hover:text-purple-600">
            {title}
          </a>
          {summary && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{summary}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            {proposer && <span>提出: {proposer}</span>}
            {submittedAt && <span>{new Date(submittedAt).toLocaleDateString("ja-JP")}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
}
