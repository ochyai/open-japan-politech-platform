import { prisma } from "@ojpp/db";
import { ApiError, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        party: true,
        proposals: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!policy) {
      throw ApiError.notFound("Policy not found");
    }

    return jsonResponse(policy);
  } catch (error) {
    return handleApiError(error);
  }
}
