export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const [policyCount, partyCount, proposalCount, categoryStats] = await Promise.all([
      prisma.policy.count(),
      prisma.party.count(),
      prisma.policyProposal.count(),
      prisma.policy.groupBy({
        by: ["category"],
        _count: true,
        orderBy: { _count: { category: "desc" } },
      }),
    ]);

    return jsonResponse({
      policyCount,
      partyCount,
      proposalCount,
      byCategory: categoryStats.map((c) => ({
        category: c.category,
        count: c._count,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
