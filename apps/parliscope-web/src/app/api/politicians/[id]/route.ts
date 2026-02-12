import { prisma } from "@ojpp/db";
import { ApiError, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const politician = await prisma.politician.findUnique({
      where: { id },
      include: {
        party: true,
        prefecture: true,
        votes: {
          include: {
            bill: { include: { session: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!politician) {
      throw ApiError.notFound("Politician not found");
    }

    return jsonResponse(politician);
  } catch (error) {
    return handleApiError(error);
  }
}
