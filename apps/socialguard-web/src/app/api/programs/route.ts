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
    const category = url.searchParams.get("category");
    const active = url.searchParams.get("active");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (active !== null) where.isActive = active === "true";

    const [data, total] = await Promise.all([
      prisma.socialSecurityProgram.findMany({
        where,
        orderBy: [{ category: "asc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.socialSecurityProgram.count({ where }),
    ]);

    return jsonResponse(
      serializeBigInt(buildPaginatedResponse(data, total, { page, limit, skip })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
