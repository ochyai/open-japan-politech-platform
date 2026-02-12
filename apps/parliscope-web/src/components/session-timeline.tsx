import { Badge } from "@ojpp/ui";

interface SessionTimelineProps {
  sessions: Array<{
    id: string;
    number: number;
    type: string;
    startDate: string;
    endDate?: string | null;
    _count?: { bills: number };
  }>;
}

const TYPE_LABELS: Record<string, { label: string; variant: "default" | "success" | "warning" | "info" }> = {
  ORDINARY: { label: "通常", variant: "info" },
  EXTRAORDINARY: { label: "臨時", variant: "warning" },
  SPECIAL: { label: "特別", variant: "success" },
};

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const typeConfig = TYPE_LABELS[session.type] ?? { label: session.type, variant: "default" as const };
        return (
          <a
            key={session.id}
            href={`/sessions/${session.id}`}
            className="block rounded-lg border bg-white p-4 transition-colors hover:border-purple-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-purple-600">第{session.number}回</span>
                <Badge variant={typeConfig.variant}>{typeConfig.label}国会</Badge>
              </div>
              {session._count && (
                <span className="text-sm text-gray-500">{session._count.bills}件の法案</span>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {new Date(session.startDate).toLocaleDateString("ja-JP")}
              {session.endDate && ` 〜 ${new Date(session.endDate).toLocaleDateString("ja-JP")}`}
            </div>
          </a>
        );
      })}
    </div>
  );
}
