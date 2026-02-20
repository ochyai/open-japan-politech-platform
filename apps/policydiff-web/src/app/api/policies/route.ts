export const dynamic = "force-dynamic";

import { buildPaginatedResponse, handleApiError, jsonResponse, parsePagination } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const party = url.searchParams.get("party");
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (party) {
      where.party = { name: party };
    }
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.policy.findMany({
        where,
        include: { party: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.policy.count({ where }),
    ]);

    return jsonResponse(buildPaginatedResponse(data, total, { page, limit, skip }));
  } catch (error) {
    return handleApiError(error);
  }
}
