export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const [orgCount, reportCount, incomeAgg, expenditureAgg, recentReports, yearlyStats] =
      await Promise.all([
        prisma.politicalOrganization.count(),
        prisma.fundReport.count(),
        prisma.fundReport.aggregate({ _sum: { totalIncome: true } }),
        prisma.fundReport.aggregate({ _sum: { totalExpenditure: true } }),
        prisma.fundReport.findMany({
          take: 5,
          orderBy: { fiscalYear: "desc" },
          include: { organization: { include: { party: true } } },
        }),
        prisma.fundReport.groupBy({
          by: ["fiscalYear"],
          _sum: { totalIncome: true, totalExpenditure: true },
          _count: true,
          orderBy: { fiscalYear: "asc" },
        }),
      ]);

    return jsonResponse(
      serializeBigInt({
        organizationCount: orgCount,
        reportCount,
        totalIncome: incomeAgg._sum.totalIncome ?? 0n,
        totalExpenditure: expenditureAgg._sum.totalExpenditure ?? 0n,
        recentReports,
        yearlyStats: yearlyStats.map((y) => ({
          year: y.fiscalYear,
          totalIncome: y._sum.totalIncome ?? 0n,
          totalExpenditure: y._sum.totalExpenditure ?? 0n,
          reportCount: y._count,
        })),
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
