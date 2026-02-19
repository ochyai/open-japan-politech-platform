export const dynamic = 'force-dynamic'
import { ApiError, handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const election = await prisma.election.findUnique({
      where: { id },
      include: {
        results: {
          include: { party: true },
          orderBy: { seatsWon: "desc" },
        },
      },
    });

    if (!election) {
      throw ApiError.notFound("Not found");
    }

    return jsonResponse(serializeBigInt(election));
  } catch (error) {
    return handleApiError(error);
  }
}
