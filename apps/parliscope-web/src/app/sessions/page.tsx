import { prisma } from "@ojpp/db";
import { SessionTimeline } from "@/components/session-timeline";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await prisma.dietSession.findMany({
    orderBy: { number: "desc" },
    include: {
      _count: { select: { bills: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-2xl font-bold">国会会期</h2>
      <p className="mb-6 text-gray-600">第200回〜第213回国会のデータ</p>
      <SessionTimeline
        sessions={sessions.map((s) => ({
          ...s,
          startDate: s.startDate.toISOString(),
          endDate: s.endDate?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
