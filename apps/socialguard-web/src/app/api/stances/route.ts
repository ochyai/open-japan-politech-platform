export const dynamic = 'force-dynamic'
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
    const topic = url.searchParams.get("topic");
    const year = url.searchParams.get("year");
    const partyId = url.searchParams.get("partyId");

    const where: Record<string, unknown> = {};
    if (topic) where.topic = topic;
    if (year) where.year = Number(year);
    if (partyId) where.partyId = partyId;

    const [data, total] = await Promise.all([
      prisma.socialSecurityStance.findMany({
        where,
        include: { party: true },
        orderBy: [{ year: "desc" }, { topic: "asc" }],
        skip,
        take: limit,
      }),
      prisma.socialSecurityStance.count({ where }),
    ]);

    return jsonResponse(
      serializeBigInt(buildPaginatedResponse(data, total, { page, limit, skip })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
