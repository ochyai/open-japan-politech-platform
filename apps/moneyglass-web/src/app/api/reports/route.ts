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
    const year = url.searchParams.get("year");
    const organizationId = url.searchParams.get("organizationId");

    const where: Record<string, unknown> = {};
    if (year) where.fiscalYear = Number(year);
    if (organizationId) where.organizationId = organizationId;

    const [data, total] = await Promise.all([
      prisma.fundReport.findMany({
        where,
        skip,
        take: limit,
        include: { organization: { include: { party: true } } },
        orderBy: [{ fiscalYear: "desc" }, { organization: { name: "asc" } }],
      }),
      prisma.fundReport.count({ where }),
    ]);

    return jsonResponse(
      serializeBigInt(buildPaginatedResponse(data, total, { page, limit, skip })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
