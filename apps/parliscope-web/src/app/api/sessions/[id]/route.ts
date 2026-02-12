import { prisma } from "@ojpp/db";
import { ApiError, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await prisma.dietSession.findUnique({
      where: { id },
      include: {
        bills: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!session) {
      throw ApiError.notFound("Session not found");
    }

    return jsonResponse(session);
  } catch (error) {
    return handleApiError(error);
  }
}
