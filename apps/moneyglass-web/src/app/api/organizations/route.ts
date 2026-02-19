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
    const party = url.searchParams.get("party");
    const type = url.searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (party) where.partyId = party;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      prisma.politicalOrganization.findMany({
        where,
        skip,
        take: limit,
        include: { party: true },
        orderBy: { name: "asc" },
      }),
      prisma.politicalOrganization.count({ where }),
    ]);

    return jsonResponse(
      serializeBigInt(buildPaginatedResponse(data, total, { page, limit, skip })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
