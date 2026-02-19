export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const elections = await prisma.election.findMany({
      include: {
        results: {
          include: { party: true },
          orderBy: { seatsWon: "desc" },
        },
      },
      orderBy: { date: "desc" },
    });
    return jsonResponse(serializeBigInt(elections));
  } catch (error) {
    return handleApiError(error);
  }
}
