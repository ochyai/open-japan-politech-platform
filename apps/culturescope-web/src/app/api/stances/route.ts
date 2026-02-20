export const dynamic = "force-dynamic";

import {
  buildPaginatedResponse,
  handleApiError,
  jsonResponse,
  parsePagination,
  serializeBigInt,
} from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);

    const url = new URL(request.url);
    const partyId = url.searchParams.get("partyId");
    const topic = url.searchParams.get("topic");
    const year = url.searchParams.get("year");

    const where: Record<string, unknown> = {};
    if (partyId) where.partyId = partyId;
    if (topic) where.topic = topic;
    if (year) where.year = Number(year);

    const [stances, total] = await Promise.all([
      prisma.culturalStance.findMany({
        where,
        include: {
          party: {
            select: { id: true, name: true, shortName: true, color: true },
          },
        },
        orderBy: [{ year: "desc" }, { topic: "asc" }],
        skip,
        take: limit,
      }),
      prisma.culturalStance.count({ where }),
    ]);

    const response = buildPaginatedResponse(serializeBigInt(stances), total, { page, limit, skip });
    return jsonResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}
