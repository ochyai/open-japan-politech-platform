"use client";

interface VoteCount {
  FOR: number;
  AGAINST: number;
  ABSTAIN: number;
  ABSENT: number;
}

export function VoteChart({ votes }: { votes: VoteCount }) {
  const total = votes.FOR + votes.AGAINST + votes.ABSTAIN + votes.ABSENT;
  if (total === 0) {
    return <p className="text-sm text-gray-500">投票データなし</p>;
  }

  const items = [
    { label: "賛成", count: votes.FOR, color: "bg-green-500" },
    { label: "反対", count: votes.AGAINST, color: "bg-red-500" },
    { label: "棄権", count: votes.ABSTAIN, color: "bg-yellow-500" },
    { label: "欠席", count: votes.ABSENT, color: "bg-gray-400" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex h-6 w-full overflow-hidden rounded-full">
        {items.map((item) =>
          item.count > 0 ? (
            <div
              key={item.label}
              className={`${item.color} transition-all`}
              style={{ width: `${(item.count / total) * 100}%` }}
              title={`${item.label}: ${item.count}`}
            />
          ) : null,
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <span>
              {item.label}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
