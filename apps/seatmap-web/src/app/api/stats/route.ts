export const dynamic = 'force-dynamic'
import { handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const [electionCount, resultCount, latestElection] = await Promise.all([
      prisma.election.count(),
      prisma.electionResult.count(),
      prisma.election.findFirst({
        orderBy: { date: "desc" },
        include: {
          results: {
            include: { party: true },
            orderBy: { seatsWon: "desc" },
          },
        },
      }),
    ]);

    return jsonResponse(
      serializeBigInt({
        electionCount,
        resultCount,
        latestElection,
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
