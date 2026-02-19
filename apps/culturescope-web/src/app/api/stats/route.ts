export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const [budgetCount, programCount, stanceCount, latestBudget] = await Promise.all([
      prisma.culturalBudget.count(),
      prisma.culturalProgram.count(),
      prisma.culturalStance.count(),
      prisma.culturalBudget.findFirst({
        where: { category: "TOTAL" },
        orderBy: { fiscalYear: "desc" },
      }),
    ]);

    return jsonResponse(
      serializeBigInt({
        budgetCount,
        programCount,
        stanceCount,
        latestFiscalYear: latestBudget?.fiscalYear ?? null,
        latestTotalBudget: latestBudget?.amount ?? 0n,
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
