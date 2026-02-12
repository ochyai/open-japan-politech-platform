import { prisma } from "@ojpp/db";
import { ApiError, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        session: true,
        votes: {
          include: { politician: { include: { party: true } } },
        },
        discussions: {
          where: { parentId: null },
          include: {
            replies: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!bill) {
      throw ApiError.notFound("Bill not found");
    }

    return jsonResponse(bill);
  } catch (error) {
    return handleApiError(error);
  }
}
