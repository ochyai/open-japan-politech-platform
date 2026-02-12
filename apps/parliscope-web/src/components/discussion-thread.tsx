import { Badge } from "@ojpp/ui";

interface Reply {
  id: string;
  content: string;
  stance?: string | null;
  createdAt: string | Date;
}

interface Discussion {
  id: string;
  content: string;
  stance?: string | null;
  createdAt: string | Date;
  replies: Reply[];
}

const STANCE_MAP: Record<string, { label: string; variant: "success" | "danger" | "default" }> = {
  FOR: { label: "賛成", variant: "success" },
  AGAINST: { label: "反対", variant: "danger" },
  NEUTRAL: { label: "中立", variant: "default" },
};

export function DiscussionThread({ discussions }: { discussions: Discussion[] }) {
  if (discussions.length === 0) {
    return <p className="text-sm text-gray-500">まだ議論がありません。</p>;
  }

  return (
    <div className="space-y-4">
      {discussions.map((d) => {
        const stanceConfig = d.stance ? STANCE_MAP[d.stance] : null;
        return (
          <div key={d.id} className="border-l-2 border-gray-200 pl-4">
            <div className="flex items-center gap-2">
              {stanceConfig && (
                <Badge variant={stanceConfig.variant}>{stanceConfig.label}</Badge>
              )}
              <span className="text-xs text-gray-400">
                {new Date(d.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-700">{d.content}</p>
            {d.replies.length > 0 && (
              <div className="mt-3 space-y-2 pl-4">
                {d.replies.map((r) => {
                  const replyStance = r.stance ? STANCE_MAP[r.stance] : null;
                  return (
                    <div key={r.id} className="border-l border-gray-100 pl-3">
                      <div className="flex items-center gap-2">
                        {replyStance && (
                          <Badge variant={replyStance.variant}>{replyStance.label}</Badge>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">{r.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
