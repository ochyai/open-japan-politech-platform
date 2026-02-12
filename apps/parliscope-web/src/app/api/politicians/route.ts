import { prisma } from "@ojpp/db";
import { parsePagination, buildPaginatedResponse, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const party = url.searchParams.get("party");
    const chamber = url.searchParams.get("chamber");
    const prefecture = url.searchParams.get("prefecture");

    const where: Record<string, unknown> = {};
    if (party) where.partyId = party;
    if (chamber) where.chamber = chamber;
    if (prefecture) where.prefectureId = prefecture;

    const [politicians, total] = await Promise.all([
      prisma.politician.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          party: true,
          prefecture: true,
          _count: { select: { votes: true } },
        },
      }),
      prisma.politician.count({ where }),
    ]);

    return jsonResponse(buildPaginatedResponse(politicians, total, { page, limit, skip }));
  } catch (error) {
    return handleApiError(error);
  }
}
