export const dynamic = 'force-dynamic'
import { ApiError, handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const partiesParam = url.searchParams.get("parties");

    if (!category) {
      throw ApiError.badRequest("category parameter is required");
    }

    const where: Record<string, unknown> = { category };

    if (partiesParam) {
      const partyNames = partiesParam.split(",").map((p) => p.trim());
      where.party = { name: { in: partyNames } };
    }

    const policies = await prisma.policy.findMany({
      where,
      include: { party: true },
      orderBy: { party: { name: "asc" } },
    });

    return jsonResponse({ data: policies, category });
  } catch (error) {
    return handleApiError(error);
  }
}
