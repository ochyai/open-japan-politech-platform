import { prisma } from "@ojpp/db";
import { handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        organizations: {
          include: {
            fundReports: {
              select: {
                totalIncome: true,
                totalExpenditure: true,
              },
            },
          },
        },
      },
    });

    const result = parties.map((party) => {
      let totalIncome = 0n;
      let totalExpenditure = 0n;
      for (const org of party.organizations) {
        for (const report of org.fundReports) {
          totalIncome += report.totalIncome;
          totalExpenditure += report.totalExpenditure;
        }
      }
      return {
        id: party.id,
        name: party.name,
        shortName: party.shortName,
        color: party.color,
        website: party.website,
        isActive: party.isActive,
        organizationCount: party.organizations.length,
        totalIncome,
        totalExpenditure,
      };
    });

    return jsonResponse(serializeBigInt(result));
  } catch (error) {
    return handleApiError(error);
  }
}
