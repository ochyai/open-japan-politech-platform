export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const [budgetCount, programCount, welfareStatCount, stanceCount, latestBudget] =
      await Promise.all([
        prisma.socialSecurityBudget.count(),
        prisma.socialSecurityProgram.count(),
        prisma.welfareStat.count(),
        prisma.socialSecurityStance.count(),
        prisma.socialSecurityBudget.findFirst({
          where: { category: "TOTAL" },
          orderBy: { fiscalYear: "desc" },
        }),
      ]);

    return jsonResponse(
      serializeBigInt({
        budgetCount,
        programCount,
        welfareStatCount,
        stanceCount,
        latestFiscalYear: latestBudget?.fiscalYear ?? null,
        latestTotalBudget: latestBudget?.amount ?? 0n,
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
