import { prisma } from "@ojpp/db";
import { handleApiError, jsonResponse } from "@ojpp/api";

export async function GET() {
  try {
    const [
      billCount,
      politicianCount,
      sessionCount,
      enactedCount,
      committeeCount,
      rejectedCount,
      submittedCount,
    ] = await Promise.all([
      prisma.bill.count(),
      prisma.politician.count(),
      prisma.dietSession.count(),
      prisma.bill.count({ where: { status: "ENACTED" } }),
      prisma.bill.count({ where: { status: "COMMITTEE" } }),
      prisma.bill.count({ where: { status: "REJECTED" } }),
      prisma.bill.count({ where: { status: "SUBMITTED" } }),
    ]);

    return jsonResponse({
      bills: billCount,
      politicians: politicianCount,
      sessions: sessionCount,
      enacted: enactedCount,
      byStatus: {
        ENACTED: enactedCount,
        COMMITTEE: committeeCount,
        REJECTED: rejectedCount,
        SUBMITTED: submittedCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
